require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');

const officers = [
  {
    name: 'PWD Officer (Demo)',
    email: 'pwd@demo.test',
    mobile: '9000000004',
    password: 'Officer@123',
    departmentCode: 'PWD',
  },
  {
    name: 'Health Officer (Demo)',
    email: 'health@demo.test',
    mobile: '9000000006',
    password: 'Officer@123',
    departmentCode: 'HEALTH',
  },
  {
    name: 'KWA Officer (Demo)',
    email: 'kwa@demo.test',
    mobile: '9000000005',
    password: 'Officer@123',
    departmentCode: 'KWA',
  },
];
async function createOfficers() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const officer of officers) {
    const department = await Department.findOne({ code: officer.departmentCode });
    if (!department) {
      throw new Error(`Department ${officer.departmentCode} not found. Seed departments first.`);
    }

    let user = await User.findOne({ email: officer.email });
    if (user && user.role !== 'officer') {
      throw new Error(`${officer.email} belongs to a non-officer account.`);
    }

    if (!user) user = new User();

    user.name = officer.name;
    user.email = officer.email;
    user.mobile = officer.mobile;
    user.password = officer.password;
    user.role = 'officer';
    user.department = department._id;

    await user.save();
    console.log(`Officer ready: ${officer.email}`);
  }
    console.log('Done. Password for all three accounts: Officer@123');
}

createOfficers()
  .catch((error) => {
    console.error('Could not create officer accounts:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });