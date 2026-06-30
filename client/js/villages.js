async function loadVillages() {
    try {
        const data = await apiRequest('/villages', 'GET', null, true);
        renderVillages(data.villages);
    } catch (error) {
        console.error('Failed to load villages:', error);
    }
}

function renderVillages(villages) {
    const tbody = document.querySelector('#villagesTable tbody');

    if (villages.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No villages added yet.</td></tr>';
        return;
    }

    tbody.innerHTML = villages.map(v => `
        <tr>
            <td>${v.villageName}</td>
            <td>${v.district}</td>
            <td>${v.state}</td>
            <td>${v.population}</td>
        </tr>
    `).join('');
}

document.getElementById('addVillageBtn').addEventListener('click', () => {
    const container = document.getElementById('villageFormContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('villageForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';

    const villageData = {
        villageName: document.getElementById('villageName').value,
        district: document.getElementById('district').value,
        state: document.getElementById('state').value,
        population: parseInt(document.getElementById('population').value) || 0,
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value)
    };

    try {
        await apiRequest('/villages', 'POST', villageData, true);
        document.getElementById('villageForm').reset();
        document.getElementById('villageFormContainer').style.display = 'none';
        loadVillages();
    } catch (error) {
        errorMessage.textContent = error.message;
    }
});

loadVillages();