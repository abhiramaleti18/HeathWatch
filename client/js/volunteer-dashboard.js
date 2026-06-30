document.getElementById('volunteerName').textContent = user.name;

async function loadMyReports() {
    try {
        const data = await apiRequest('/reports/my-reports', 'GET', null, true);
        renderMyReports(data.reports);
    } catch (error) {
        console.error('Failed to load reports:', error);
        document.querySelector('#myReportsTable tbody').innerHTML = 
            '<tr><td colspan="4">Unable to load your reports.</td></tr>';
    }
}

function renderMyReports(reports) {
    const tbody = document.querySelector('#myReportsTable tbody');

    if (reports.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No reports submitted yet.</td></tr>';
        return;
    }

    tbody.innerHTML = reports.map(r => `
        <tr>
            <td>${new Date(r.reportDate).toLocaleDateString()}</td>
            <td>${r.villageId?.villageName || 'Unknown'}</td>
            <td>${r.suspectedDisease || 'N/A'}</td>
            <td>${r.affectedCount}</td>
        </tr>
    `).join('');
}

loadMyReports();