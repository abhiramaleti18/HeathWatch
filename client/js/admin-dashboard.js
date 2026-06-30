async function loadDashboard() {
    try {
        const data = await apiRequest('/dashboard', 'GET', null, true);
        renderStats(data.stats);
        renderRecentReports(data.mostAffected);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

function renderStats(stats) {
    document.getElementById('totalVillages').textContent = stats.totalVillages;
    document.getElementById('totalReports').textContent = stats.totalReports;
    document.getElementById('activeAlerts').textContent = stats.activeAlerts;
}

function renderRecentReports(villages) {
    const table = document.getElementById('recentReportsTable');
    if (!table) return;

    // recentReportsTable is the <table> itself — target its tbody
    const tbody = table.tagName === 'TABLE' ? table.querySelector('tbody') : table;
    if (!tbody) return;

    if (!villages || villages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No reports yet.</td></tr>';
        return;
    }

    tbody.innerHTML = villages.map(v => `
        <tr>
            <td>${v.villageName}</td>
            <td>${v.district}</td>
            <td>-</td>
            <td>-</td>
            <td>${v.totalAffected} affected</td>
        </tr>
    `).join('');
}

loadDashboard();