const HealthReport = require('../models/HealthReport');
const Village = require('../models/Village');
const Alert = require('../models/Alert');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
    try {
        const totalVillages = await Village.countDocuments();
        const totalReports = await HealthReport.countDocuments();
        const activeAlerts = await Alert.countDocuments({ status: 'active' });
        const totalUsers = await User.countDocuments();

        const criticalAlerts = await Alert.countDocuments({ 
            status: 'active', 
            riskLevel: 'critical' 
        });

        const highAlerts = await Alert.countDocuments({ 
            status: 'active', 
            riskLevel: 'high' 
        });

        // Reports in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentReports = await HealthReport.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        // Most affected villages
        const mostAffected = await HealthReport.aggregate([
            {
                $group: {
                    _id: '$villageId',
                    totalAffected: { $sum: '$affectedCount' },
                    reportCount: { $sum: 1 }
                }
            },
            { $sort: { totalAffected: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'villages',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'village'
                }
            },
            { $unwind: '$village' },
            {
                $project: {
                    villageName: '$village.villageName',
                    district: '$village.district',
                    totalAffected: 1,
                    reportCount: 1
                }
            }
        ]);

        // Disease distribution
        const diseaseDistribution = await HealthReport.aggregate([
            { $match: { suspectedDisease: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: '$suspectedDisease',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalVillages,
                totalReports,
                activeAlerts,
                totalUsers,
                criticalAlerts,
                highAlerts,
                recentReports
            },
            mostAffected,
            diseaseDistribution
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAnalytics = async (req, res) => {
    try {
        // Reports per day for last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const reportsTrend = await HealthReport.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    totalAffected: { $sum: '$affectedCount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Symptom frequency
        const symptomFrequency = await HealthReport.aggregate([
            { $unwind: '$symptoms' },
            {
                $group: {
                    _id: '$symptoms',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Alerts by risk level
        const alertsByRisk = await Alert.aggregate([
            {
                $group: {
                    _id: '$riskLevel',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            reportsTrend,
            symptomFrequency,
            alertsByRisk
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};