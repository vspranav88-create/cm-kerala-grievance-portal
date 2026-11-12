require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : '*' }));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({ message: 'CM Kerala Grievance Portal API (recruitment prototype - not a Govt. of Kerala service)' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/grievances', require('./routes/grievances'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api', require('./routes/public'));

// Central error handler (also catches multer upload errors)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 400).json({ message: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('MongoDB connected'); app.listen(PORT, () => console.log('API running on port ' + PORT)); })
  .catch(err => { console.error('DB connection failed:', err.message); process.exit(1); });
