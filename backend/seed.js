// Run once:  npm run seed   (wipes and refills the database with FICTIONAL data)
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
const Grievance = require('./models/Grievance');
const Contact = require('./models/Contact');
const { DEPARTMENTS } = require('./config/constants');

const DAY = 86400000;

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Department.deleteMany(), Grievance.deleteMany(), Contact.deleteMany()]);

  const depts = await Department.insertMany(DEPARTMENTS.map(({ keywords, ...d }) => d));
  const byCode = Object.fromEntries(depts.map(d => [d.code, d]));

  const cmo = await User.create({ name: 'CMO Admin (Demo)', email: 'cmo@demo.test', mobile: '9000000001', password: 'cymo@12345', role: 'cmo' });
  const citizen = await User.create({ name: 'Anu Nair (Demo)', email: 'citizen@demo.test', mobile: '9000000002', password: 'Citizen@123', role: 'citizen' });
  const citizen2 = await User.create({ name: 'Rahul K (Demo)', email: 'citizen2@demo.test', mobile: '9000000003', password: 'Citizen@123', role: 'citizen' });
  const pwdOfficer = await User.create({ name: 'PWD Officer (Demo)', email: 'pwd@demo.test', mobile: '9000000004', password: 'Officer@123', role: 'officer', department: byCode.PWD._id });
  await User.create({ name: 'KWA Officer (Demo)', email: 'kwa@demo.test', mobile: '9000000005', password: 'Officer@123', role: 'officer', department: byCode.KWA._id });
  await User.create({ name: 'Health Officer (Demo)', email: 'health@demo.test', mobile: '9000000006', password: 'Officer@123', role: 'officer', department: byCode.HEALTH._id });

  const h = (u, action, status, remark, daysAgo) => ({ action, status, remark, by: u._id, byName: u.name, byRole: u.role, at: new Date(Date.now() - daysAgo * DAY) });
  const samples = [
    { refId: 'CMK2026-100001', citizen, district: 'Thiruvananthapuram', category: 'Roads & Infrastructure', subject: 'Large potholes near bus stand',
      description: 'There are many deep potholes on the main road near the bus stand. Two-wheelers are slipping every day and it is dangerous for school children.',
      priority: 'High', status: 'In Progress', department: byCode.PWD, officer: pwdOfficer, age: 12,
      history: [h(citizen, 'Grievance submitted', 'Submitted', 'Submitted by citizen', 12), h(cmo, 'Forwarded to Public Works Department', 'In Progress', 'Please inspect urgently', 11), h(pwdOfficer, 'Status changed to In Progress', 'In Progress', 'Site inspection done, work order issued', 9)] },
    { refId: 'CMK2026-100002', citizen, district: 'Ernakulam', category: 'Water Supply', subject: 'No drinking water for 4 days',
      description: 'Our ward has not received any drinking water supply for four days. Please arrange tanker water and fix the pipe leak.',
      priority: 'High', status: 'Under Review', age: 2,
      history: [h(citizen, 'Grievance submitted', 'Submitted', 'Submitted by citizen', 2), h(cmo, 'Status changed to Under Review', 'Under Review', 'Being reviewed by CMO', 1)] },
    { refId: 'CMK2026-100003', citizen: citizen2, district: 'Kozhikode', category: 'Healthcare', subject: 'Doctor not available at primary health centre',
      description: 'The primary health centre has had no doctor in the afternoons for the last two weeks. Patients are forced to travel far.',
      priority: 'Medium', status: 'Submitted', age: 1,
      history: [h(citizen2, 'Grievance submitted', 'Submitted', 'Submitted by citizen', 1)] },
    { refId: 'CMK2026-100004', citizen: citizen2, district: 'Thrissur', category: 'Local Self Government', subject: 'Garbage not collected',
      description: 'Garbage has not been collected from our street for three weeks and stray dogs are spreading waste everywhere.',
      priority: 'Low', status: 'Resolved', age: 25,
      history: [h(citizen2, 'Grievance submitted', 'Submitted', 'Submitted by citizen', 25), h(cmo, 'Resolved after CMO review', 'Resolved', 'Collection restarted', 5)] }
  ];
  for (const s of samples) {
    await Grievance.create({
      ...s, citizen: s.citizen._id, department: s.department && s.department._id, officer: s.officer && s.officer._id,
      dueDate: new Date(Date.now() + (s.priority === 'High' ? 7 : s.priority === 'Medium' ? 15 : 30) * DAY - s.age * DAY)
    });
  }
  await Contact.create({ name: 'Sample User', email: 'sample@demo.test', subject: 'Test enquiry', message: 'This is a fictional enquiry.' });

  console.log('Seeded. Demo logins:');
  console.log(' CMO      cmo@demo.test      / Cmo@12345');
  console.log(' Citizen  citizen@demo.test  / Citizen@123');
  console.log(' Officer  pwd@demo.test      / Officer@123  (also kwa@ and health@)');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
