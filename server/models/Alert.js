const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    villageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
        required: true
    },
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    reportIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthReport'
    }],
    recommendations: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['active', 'resolved', 'dismissed'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);