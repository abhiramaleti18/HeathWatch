const mongoose = require('mongoose');

const healthReportSchema = new mongoose.Schema({
    villageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village',
        required: [true, 'Village is required']
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Reporter is required']
    },
    reportType: {
        type: String,
        enum: ['water-borne', 'vector-borne', 'respiratory', 'other'],
        default: 'other'
    },
    affectedCount: {
        type: Number,
        required: [true, 'Affected count is required'],
        min: 1
    },
    ageGroup: {
        type: String,
        enum: ['children', 'adults', 'elderly', 'all'],
        default: 'all'
    },
    symptoms: [{
        type: String,
        trim: true
    }],
    suspectedDisease: {
        type: String,
        trim: true
    },
    waterSource: {
        type: String,
        enum: ['well', 'borewell', 'river', 'piped', 'unknown'],
        default: 'unknown'
    },
    notes: {
        type: String,
        trim: true
    },
    reportDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('HealthReport', healthReportSchema);