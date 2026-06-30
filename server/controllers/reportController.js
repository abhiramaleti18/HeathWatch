const HealthReport = require('../models/HealthReport');
const { analyzeVillage } = require('../services/predictionService');

exports.createReport = async (req, res) => {
    try {
        const report = await HealthReport.create({
            ...req.body,
            reportedBy: req.user._id
        });

        // Run prediction engine after report is saved
        const analysis = await analyzeVillage(req.body.villageId);

        res.status(201).json({ 
            success: true, 
            report,
            analysis: analysis || { message: 'Not enough data for analysis' }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getReports = async (req, res) => {
    try {
        const reports = await HealthReport.find()
            .populate('villageId', 'villageName district')
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: reports.length, reports });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getReport = async (req, res) => {
    try {
        const report = await HealthReport.findById(req.params.id)
            .populate('villageId', 'villageName district')
            .populate('reportedBy', 'name email');

        if (!report) return res.status(404).json({ message: 'Report not found' });

        res.status(200).json({ success: true, report });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const report = await HealthReport.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.status(200).json({ success: true, message: 'Report deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getReportsByVillage = async (req, res) => {
    try {
        const reports = await HealthReport.find({ villageId: req.params.villageId })
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: reports.length, reports });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getMyReports = async (req, res) => {
    try {
        const reports = await HealthReport.find({ reportedBy: req.user._id })
            .populate('villageId', 'villageName district')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: reports.length, reports });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};