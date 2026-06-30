async function loadReports() {
    try {
        const data = await apiRequest('/reports', 'GET', null, true);
        renderReports(data.reports);
    } catch (error) {
        console.error('Failed to load reports:', error);
        document.querySelector('#reportsTable tbody').innerHTML = 
            '<tr><td colspan="7">Failed to load reports.</td></tr>';
    }
}

function renderReports(reports) {
    const tbody = document.querySelector('#reportsTable tbody');

    if (reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No reports found.</td></tr>';
        return;
    }

    tbody.innerHTML = reports.map(r => `
        <tr>
            <td>${new Date(r.reportDate).toLocaleDateString()}</td>
            <td>${r.villageId?.villageName || 'Unknown'}</td>
            <td>${r.reportedBy?.name || 'Unknown'}</td>
            <td>${r.suspectedDisease || 'N/A'}</td>
            <td>${r.affectedCount}</td>
            <td>${r.symptoms.join(', ')}</td>
            <td>${r.waterSource}</td>
        </tr>
    `).join('');
}

loadReports();