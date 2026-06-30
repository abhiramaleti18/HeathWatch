// Load villages into dropdown
async function loadVillages() {
    try {
        const data = await apiRequest('/villages', 'GET', null, true);
        const select = document.getElementById('villageId');

        if (data.villages.length === 0) {
            select.innerHTML = '<option value="">No villages available</option>';
            return;
        }

        select.innerHTML = '<option value="">Select a village</option>' + 
            data.villages.map(v => `<option value="${v._id}">${v.villageName}, ${v.district}</option>`).join('');

    } catch (error) {
        document.getElementById('villageId').innerHTML = '<option value="">Failed to load villages</option>';
    }
}

document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    successMessage.textContent = '';
    errorMessage.textContent = '';

    // Collect checked symptoms
    const symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked'))
        .map(checkbox => checkbox.value);

    const reportData = {
        villageId: document.getElementById('villageId').value,
        reportType: document.getElementById('reportType').value,
        affectedCount: parseInt(document.getElementById('affectedCount').value),
        ageGroup: document.getElementById('ageGroup').value,
        symptoms,
        suspectedDisease: document.getElementById('suspectedDisease').value,
        waterSource: document.getElementById('waterSource').value,
        notes: document.getElementById('notes').value
    };

    try {
        const data = await apiRequest('/reports', 'POST', reportData, true);

        let message = 'Report submitted successfully!';
        if (data.analysis && data.analysis.riskLevel) {
            message += ` Risk Level: ${data.analysis.riskLevel.toUpperCase()}`;
        }

        successMessage.textContent = message;
        document.getElementById('reportForm').reset();

    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

loadVillages();