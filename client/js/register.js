document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role').value;
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = '';

    try {
        const data = await apiRequest('/auth/register', 'POST', { name, email, password, phone, role });

        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        if (data.user.role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else if (data.user.role === 'officer') {
            window.location.href = 'officer-dashboard.html';
        } else {
            window.location.href = 'volunteer-dashboard.html';
        }

    } catch (error) {
        errorMessage.textContent = error.message;
    }
});