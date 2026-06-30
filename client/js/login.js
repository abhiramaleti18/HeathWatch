document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    errorMessage.textContent = '';

    try {
        const data = await apiRequest('/auth/login', 'POST', { email, password });

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