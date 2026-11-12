// Shared lists used by models, seed data and the AI service
const STATUSES = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Reopened'];
const PRIORITIES = ['Low', 'Medium', 'High'];

const DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
  'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

const CATEGORIES = [
  'Roads & Infrastructure', 'Healthcare', 'Education', 'Water Supply',
  'Electricity', 'Food & Civil Supplies', 'Police & Safety',
  'Revenue & Land', 'Local Self Government', 'Other'
];

// Fictional sample departments. "keywords" are only used by the fallback classifier.
const DEPARTMENTS = [
  { code: 'PWD', name: 'Public Works Department', category: 'Roads & Infrastructure',
    description: 'Roads, bridges and government buildings.',
    keywords: ['road', 'pothole', 'bridge', 'highway', 'footpath', 'construction'] },
  { code: 'HEALTH', name: 'Health & Family Welfare Department', category: 'Healthcare',
    description: 'Hospitals, primary health centres and public health.',
    keywords: ['hospital', 'doctor', 'medicine', 'clinic', 'patient', 'health', 'nurse'] },
  { code: 'EDU', name: 'General Education Department', category: 'Education',
    description: 'Government schools, teachers and student welfare.',
    keywords: ['school', 'teacher', 'student', 'exam', 'education', 'college', 'scholarship'] },
  { code: 'KWA', name: 'Kerala Water Authority', category: 'Water Supply',
    description: 'Drinking water supply and sewerage.',
    keywords: ['water', 'pipe', 'tap', 'drinking', 'sewage', 'leak', 'drain'] },
  { code: 'KSEB', name: 'Electricity Department', category: 'Electricity',
    description: 'Power supply, billing and street lights.',
    keywords: ['electricity', 'power', 'current', 'transformer', 'street light', 'voltage', 'bill'] },
  { code: 'CIVIL', name: 'Food & Civil Supplies Department', category: 'Food & Civil Supplies',
    description: 'Ration shops and essential commodities.',
    keywords: ['ration', 'rice', 'supplyco', 'card', 'food', 'grain'] },
  { code: 'POLICE', name: 'Home (Police) Department', category: 'Police & Safety',
    description: 'Law and order, public safety and traffic.',
    keywords: ['police', 'theft', 'crime', 'safety', 'harassment', 'traffic', 'accident'] },
  { code: 'REV', name: 'Revenue Department', category: 'Revenue & Land',
    description: 'Land records, certificates and disaster relief.',
    keywords: ['land', 'certificate', 'tax', 'village office', 'patta', 'survey'] },
  { code: 'LSGD', name: 'Local Self Government Department', category: 'Local Self Government',
    description: 'Panchayats, municipalities and waste management.',
    keywords: ['panchayat', 'garbage', 'waste', 'municipality', 'corporation', 'license', 'stray'] }
];

module.exports = { STATUSES, PRIORITIES, DISTRICTS, CATEGORIES, DEPARTMENTS };
