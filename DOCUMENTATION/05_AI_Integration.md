# 05 — AI Integration

## Purpose and model/API

The backend optionally calls Google's Gemini API through the REST `generateContent` endpoint:

```text
POST https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent
```

The model is configured by `GEMINI_MODEL` (the supplied example uses `gemini-3.5-flash`). The backend authenticates using `GEMINI_API_KEY` in the `x-goog-api-key` header. The key must never be sent to the browser or committed to source control.

## Workflow and prompt

1. An authenticated citizen or CMO user requests analysis through `POST /api/ai/analyze` with a description of at least 20 characters and an optional district.
2. Backend `services/aiService.js` builds a prompt containing the allowed department names, categories, priority values and expected JSON fields.
3. Gemini is asked for JSON with `department`, `category`, `priority`, and a short `summary`.
4. If Gemini is not configured or its request/JSON parsing fails, the backend logs a warning and computes a keyword-based suggestion.
5. The backend checks the model's department, category and priority against allowed values and returns the suggestion, source, optional note and possible duplicate references.
6. The citizen may review/edit the suggestion before submission. The CMO makes the assignment and resolution decisions.

Simplified prompt structure:

```text
Analyze this public grievance. Reply only with JSON.
Allowed departments: [configured department names]
Allowed categories: [configured category names]
Priority: Low, Medium, or High.
Return: { department, category, priority, summary }.
District: [district or unknown]
Complaint: [citizen-provided description]
```

## Fallback classifier

The fallback counts configured department keywords appearing in the lowercased description. The department with the most matches is suggested. If there are no matches, it suggests Local Self Government Department and category Other. It marks a complaint High if it contains one of a small list of urgent terms; otherwise a description longer than 300 characters becomes Medium, and shorter descriptions become Low.

The backend also checks recent complaints in the same district, within the preceding 30 days and up to 200 records. It tokenizes words longer than three characters and reports reference IDs with Jaccard similarity above 0.5. This is a heuristic duplicate warning, not a decision that two cases are the same.

## Limitations

- Gemini can be unavailable, rate-limited, misconfigured, or return invalid output. In those cases, fallback is used.
- Keyword matching depends on the configured vocabulary and may miss spelling variants, context, Malayalam text or previously unseen issue descriptions.
- AI classification can be wrong or biased. It does not verify allegations, determine eligibility, investigate incidents, or resolve a grievance.
- Duplicate detection can produce false positives and false negatives because it uses simple token overlap.
- Prompt-injected or misleading citizen text is untrusted input; it must not override backend rules or staff review.

## Safeguards

- API key stays in the backend environment.
- Analysis endpoint requires authentication and is limited to citizen/CMO roles.
- Input must contain at least 20 characters.
- Model output is parsed and validated against fixed departments, categories and priorities; invalid values are replaced with safe defaults/fallbacks.
- AI result is stored as a suggestion and is not allowed to assign departments, change status, or resolve cases autonomously.
- Staff remain responsible for human review and decisions.
