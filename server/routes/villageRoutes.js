const express = require('express');
const router = express.Router();
const { getVillages, createVillage, updateVillage, getVillage } = require('../controllers/villageController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getVillages);
router.post('/', protect, authorize('admin'), createVillage);
router.put('/:id', protect, authorize('admin'), updateVillage);
router.get('/:id', protect, getVillage);

module.exports = router;