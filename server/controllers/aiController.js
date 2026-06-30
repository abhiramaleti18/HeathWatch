const { chat, summarizeReports, generateAwareness } = require('../services/aiService');
const HealthReport = require('../models/HealthReport');
const ChatHistory = require('../models/ChatHistory');

exports.chatWithAI = async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ message: 'Prompt is required' });

        const response = await chat(prompt);

        await ChatHistory.create({
            userId: req.user._id,
            prompt,
            response
        });

        res.status(200).json({ success: true, response });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.summarize = async (req, res) => {
    try {
        const { villageId } = req.body;

        const reports = await HealthReport.find({ villageId })
            .populate('villageId', 'villageName')
            .sort({ createdAt: -1 })
            .limit(10);

        if (reports.length === 0) {
            return res.status(404).json({ message: 'No reports found for this village' });
        }

        const summary = await summarizeReports(reports);
        res.status(200).json({ success: true, summary });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.awareness = async (req, res) => {
    try {
        const { disease, language } = req.body;
        if (!disease) return res.status(400).json({ message: 'Disease is required' });

        const content = await generateAwareness(disease, language);
        res.status(200).json({ success: true, content });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};