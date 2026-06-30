const AwarenessPost = require('../models/AwarenessPost');

exports.getPosts = async (req, res) => {
    try {
        const posts = await AwarenessPost.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: posts.length, posts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const post = await AwarenessPost.create(req.body);
        res.status(201).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await AwarenessPost.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json({ success: true, message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};