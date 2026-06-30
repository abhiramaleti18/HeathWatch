const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

//app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const villageRoutes = require('./routes/villageRoutes');
app.use('/api/villages', villageRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const alertRoutes = require('./routes/alertRoutes');
app.use('/api/alerts', alertRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

const awarenessRoutes = require('./routes/awarenessRoutes');
app.use('/api/awareness', awarenessRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Health Surveillance API is running' });
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });