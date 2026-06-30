const express = require('express');
const router = express.Router();
const { chatWithAI, summarize, awareness } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/chat', protect, chatWithAI);
router.post('/summary', protect, summarize);
router.post('/awareness', protect, awareness);

module.exports = router;