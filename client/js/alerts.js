let allAlerts = [];

async function loadAlerts() {
    try {
        const data = await apiRequest('/alerts', 'GET', null, true);
        allAlerts = data.alerts;
        renderAlerts(allAlerts);
    } catch (error) {
        console.error('Failed to load alerts:', error);
        document.getElementById('alertsContainer').innerHTML = '<p>Failed to load alerts.</p>';
    }
}

function renderAlerts(alerts) {
    const container = document.getElementById('alertsContainer');

    if (alerts.length === 0) {
        container.innerHTML = '<p>No alerts found.</p>';
        return;
    }

    container.innerHTML = alerts.map(alert => `
        <div class="alert-item risk-${alert.riskLevel}">
            <div class="alert-header">
                <strong>${alert.villageId?.villageName || 'Unknown Village'}</strong>
                <span class="risk-badge">${alert.riskLevel.toUpperCase()}</span>
            </div>
            <p>${alert.reason}</p>
            <ul>
                ${alert.recommendations.map(r => `<li>${r}</li>`).join('')}
            </ul>
            <div class="alert-actions">
                <span class="status-label">Status: ${alert.status}</span>
                ${alert.status === 'active' ? `
                    <button class="btn-small" onclick="updateAlertStatus('${alert._id}', 'resolved')">Mark Resolved</button>
                    <button class="btn-small" onclick="updateAlertStatus('${alert._id}', 'dismissed')">Dismiss</button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

async function updateAlertStatus(alertId, status) {
    try {
        await apiRequest(`/alerts/${alertId}`, 'PUT', { status }, true);
        loadAlerts();
    } catch (error) {
        alert('Failed to update alert: ' + error.message);
    }
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        const filtered = filter === 'all' ? allAlerts : allAlerts.filter(a => a.status === filter);
        renderAlerts(filtered);
    });
});

loadAlerts();