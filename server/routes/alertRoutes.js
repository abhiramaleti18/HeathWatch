const express = require('express');
const router = express.Router();
const { getAlerts, updateAlert } = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('officer', 'admin'), getAlerts);
router.put('/:id', protect, authorize('officer', 'admin'), updateAlert);

module.exports = router;