const { DEPARTMENTS, CATEGORIES } = require('../config/constants');
const Grievance = require('../models/Grievance');

const DEPT_NAMES = DEPARTMENTS.map(d => d.name);

// ---------- 1. Real LLM call (Google Gemini, free tier) ----------
async function callGemini(description, district) {
  const prompt = `You are an assistant for a public grievance portal. Analyse the citizen complaint and reply ONLY with JSON.
Allowed departments: ${JSON.stringify(DEPT_NAMES)}
Allowed categories: ${JSON.stringify(CATEGORIES)}
Priority must be one of: "Low", "Medium", "High" (High = danger to life/health or urgent public safety).
JSON format: {"department": "...", "category": "...", "priority": "...", "summary": "max 30 words summary for the Chief Minister's Office"}
District: ${district || 'unknown'}
Complaint: """${description}"""`;

  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(15000),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `Gemini HTTP ${res.status}: ${data.error?.message || 'Unknown API error'}`
    );
  }

  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!responseText) {
    throw new Error('Gemini returned an empty response');
  }

  return JSON.parse(responseText);
}

// ---------- 2. Labelled fallback (simple keywords) ----------
function keywordFallback(description) {
  const text = description.toLowerCase();
  let best = DEPARTMENTS[0], bestScore = 0;
  for (const d of DEPARTMENTS) {
    const score = d.keywords.filter(k => text.includes(k)).length;
    if (score > bestScore) { best = d; bestScore = score; }
  }
  const urgent = ['urgent', 'emergency', 'danger', 'accident', 'death', 'fire', 'flood', 'collapse', 'injured', 'unsafe'];
  const priority = urgent.some(w => text.includes(w)) ? 'High' : (description.length > 300 ? 'Medium' : 'Low');
  return {
    department: bestScore ? best.name : 'Local Self Government Department',
    category: bestScore ? best.category : 'Other',
    priority,
    summary: description.length > 150 ? description.slice(0, 147) + '...' : description
  };
}

// ---------- 3. Duplicate check (word overlap with recent complaints in same district) ----------
const words = (t) => new Set(t.toLowerCase().split(/\W+/).filter(w => w.length > 3));

async function findDuplicates(description, district) {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recent = await Grievance.find({ district, createdAt: { $gte: since } })
    .select('refId description').limit(200);
  const mine = words(description);
  if (mine.size === 0) return [];
  return recent.filter(g => {
    const other = words(g.description);
    const common = [...mine].filter(w => other.has(w)).length;
    return common / (mine.size + other.size - common) > 0.5; // Jaccard similarity
  }).map(g => g.refId);
}

// ---------- Main function used by the route ----------
exports.analyzeComplaint = async (description, district) => {
  let result, source, note;
  if (process.env.GEMINI_API_KEY) {
    try {
      result = await callGemini(description, district);
      source = 'gemini';
    } catch (err) {
      console.error('AI call failed, using fallback:', err.message);
      note = 'AI service unavailable - keyword fallback used';
    }
  } else {
    note = 'No AI key configured - keyword fallback used';
  }
  if (!result) { result = keywordFallback(description); source = 'fallback-keyword'; }

  // Safety: never trust model output blindly - validate against allowed lists
  if (!DEPT_NAMES.includes(result.department)) result.department = keywordFallback(description).department;
  if (!CATEGORIES.includes(result.category)) result.category = 'Other';
  if (!['Low', 'Medium', 'High'].includes(result.priority)) result.priority = 'Medium';
  result.summary = String(result.summary || '').slice(0, 300);

  const possibleDuplicates = district ? await findDuplicates(description, district) : [];
  return { ...result, source, note, possibleDuplicates };
};
