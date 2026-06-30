// Show generate button only for admin/officer
if (user.role === 'admin' || user.role === 'officer') {
    document.getElementById('generateSection').style.display = 'block';
}

async function loadPosts() {
    try {
        const data = await apiRequest('/awareness', 'GET', null, false);
        renderPosts(data.posts);
    } catch (error) {
        console.error('Failed to load posts:', error);
    }
}

function renderPosts(posts) {
    const container = document.getElementById('postsContainer');

    if (posts.length === 0) {
        container.innerHTML = '<p>No awareness posts yet.</p>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <h3>${post.title}</h3>
            <span class="post-language">${post.language}</span>
            <p>${post.content}</p>
        </div>
    `).join('');
}

const generateBtn = document.getElementById('generateBtn');
if (generateBtn) {
    generateBtn.addEventListener('click', () => {
        const container = document.getElementById('generateFormContainer');
        container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });
}

const generateForm = document.getElementById('generateForm');
if (generateForm) {
    generateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = '';

        const disease = document.getElementById('disease').value;
        const language = document.getElementById('language').value;

        try {
            // Generate content via AI
            const aiData = await apiRequest('/ai/awareness', 'POST', { disease, language }, true);

            // Save as awareness post
            await apiRequest('/awareness', 'POST', {
                title: `${disease} Awareness`,
                content: aiData.content,
                disease,
                language
            }, true);

            document.getElementById('generateForm').reset();
            document.getElementById('generateFormContainer').style.display = 'none';
            loadPosts();

        } catch (error) {
            errorMessage.textContent = error.message;
        }
    });
}

loadPosts();