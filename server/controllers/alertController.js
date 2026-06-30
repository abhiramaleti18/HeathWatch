const Alert = require('../models/Alert');

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find()
            .populate('villageId', 'villageName district')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: alerts.length, alerts });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateAlert = async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!alert) return res.status(404).json({ message: 'Alert not found' });

        res.status(200).json({ success: true, alert });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};