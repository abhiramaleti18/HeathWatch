const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost } = require('../controllers/awarenessController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getPosts);
router.post('/', protect, authorize('admin', 'officer'), createPost);
router.delete('/:id', protect, authorize('admin'), deletePost);

module.exports = router;