const mongoose = require('mongoose');

const awarenessPostSchema = new mongoose.Schema({
    language: {
        type: String,
        default: 'english',
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    disease: {
        type: String,
        trim: true
    }
}, { timestamps: true });

module.exports = mongoose.model('AwarenessPost', awarenessPostSchema);