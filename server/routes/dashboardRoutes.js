const express = require('express');
const router = express.Router();
const { getDashboard, getAnalytics } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('officer', 'admin'), getDashboard);
router.get('/analytics', protect, authorize('officer', 'admin'), getAnalytics);

module.exports = router;