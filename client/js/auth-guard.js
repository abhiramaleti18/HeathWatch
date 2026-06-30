const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || 'null');

if (!token || !user) {
    window.location.href = 'login.html';
}

const userNameEl = document.getElementById('userName');
if (userNameEl) {
    userNameEl.textContent = `Hi, ${user.name}`;
}

const adminNameEl = document.getElementById('adminName');
if (adminNameEl) {
    adminNameEl.textContent = `Welcome, ${user.name}`;
}

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}