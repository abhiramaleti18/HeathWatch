const sidebarLinks = {
    admin: [
        { href: 'admin-dashboard.html', label: 'Dashboard' },
        { href: 'villages.html', label: 'Villages' },
        { href: 'alerts.html', label: 'Alerts' },
        { href: 'reports.html', label: 'Reports' },
        { href: 'awareness.html', label: 'Awareness' },
        { href: 'ai-assistant.html', label: 'AI Assistant' }
    ],
    officer: [
        { href: 'officer-dashboard.html', label: 'Dashboard' },
        { href: 'reports.html', label: 'Reports' },
        { href: 'alerts.html', label: 'Alerts' },
        { href: 'ai-assistant.html', label: 'AI Assistant' }
    ],
    volunteer: [
        { href: 'volunteer-dashboard.html', label: 'Dashboard' },
        { href: 'submit-report.html', label: 'Submit Report' },
        { href: 'awareness.html', label: 'Awareness' },
        { href: 'ai-assistant.html', label: 'AI Assistant' }
    ]
};

function renderSidebar() {
    const sidebar = document.getElementById('sidebarNav');
    if (!sidebar) return;

    const links = sidebarLinks[user.role] || [];
    const currentPage = window.location.pathname.split('/').pop();

    sidebar.innerHTML = links.map(link => 
        `<a href="${link.href}" class="${link.href === currentPage ? 'active' : ''}">${link.label}</a>`
    ).join('');
}

renderSidebar();