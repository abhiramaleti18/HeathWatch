const HealthReport = require('../models/HealthReport');
const Alert = require('../models/Alert');

const calculateRiskScore = (reports) => {
    let score = 0;

    const symptomCounts = {};
    reports.forEach(report => {
        report.symptoms.forEach(symptom => {
            symptomCounts[symptom] = (symptomCounts[symptom] || 0) + report.affectedCount;
        });
    });

    if ((symptomCounts['diarrhea'] || 0) >= 5) score += 20;
    if ((symptomCounts['vomiting'] || 0) >= 5) score += 20;
    if ((symptomCounts['fever'] || 0) >= 3) score += 15;

    const totalAffected = reports.reduce((sum, r) => sum + r.affectedCount, 0);
    if (totalAffected >= 10) score += 20;

    const unsafeWater = reports.some(r => ['river', 'well', 'borewell'].includes(r.waterSource));
    if (unsafeWater) score += 15;

    const hasActiveAlert = reports.length > 0;
    if (hasActiveAlert) score += 10;

    return score;
};

const getRiskLevel = (score) => {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
};

const getRecommendations = (riskLevel, symptomCounts) => {
    const base = [
        'Monitor affected individuals closely',
        'Ensure clean drinking water supply'
    ];

    if (riskLevel === 'critical') {
        return [
            'Immediate medical intervention required',
            'Deploy emergency health team to village',
            'Isolate contaminated water sources',
            'Alert district health authorities',
            ...base
        ];
    }

    if (riskLevel === 'high') {
        return [
            'Send health officer to village immediately',
            'Distribute water purification tablets',
            'Conduct door-to-door health survey',
            ...base
        ];
    }

    if (riskLevel === 'medium') {
        return [
            'Schedule health officer visit within 24 hours',
            'Distribute awareness material',
            ...base
        ];
    }

    return base;
};

exports.analyzeVillage = async (villageId) => {
    // Get reports from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const reports = await HealthReport.find({
        villageId,
        createdAt: { $gte: sevenDaysAgo }
    });

    if (reports.length === 0) return null;

    const score = calculateRiskScore(reports);
    const riskLevel = getRiskLevel(score);
    const recommendations = getRecommendations(riskLevel, {});
    const reportIds = reports.map(r => r._id);

    // Only create alert if medium or above
    if (score >= 30) {
        const existingAlert = await Alert.findOne({
            villageId,
            status: 'active'
        });

        if (!existingAlert) {
            await Alert.create({
                villageId,
                riskLevel,
                reason: `Risk score of ${score} detected based on recent reports`,
                reportIds,
                recommendations,
                status: 'active'
            });
        } else {
            await Alert.findByIdAndUpdate(existingAlert._id, {
                riskLevel,
                reason: `Risk score of ${score} detected based on recent reports`,
                reportIds,
                recommendations
            });
        }
    }

    return { score, riskLevel, recommendations };
};