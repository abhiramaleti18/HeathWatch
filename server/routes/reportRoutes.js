const express = require('express');
const router = express.Router();
const { createReport, getReports, getReport, deleteReport, getReportsByVillage, getMyReports } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my-reports', protect, getMyReports);

router.post('/', protect, authorize('volunteer', 'officer', 'admin'), createReport);
router.get('/', protect, authorize('officer', 'admin'), getReports);
router.get('/:id', protect, getReport);
router.delete('/:id', protect, authorize('admin'), deleteReport);
router.get('/village/:villageId', protect, getReportsByVillage);

module.exports = router;