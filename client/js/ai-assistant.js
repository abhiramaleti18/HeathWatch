const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', `chat-${sender}`);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const prompt = chatInput.value.trim();
    if (!prompt) return;

    addMessage(prompt, 'user');
    chatInput.value = '';

    const loadingMsg = document.createElement('div');
    loadingMsg.classList.add('chat-message', 'chat-ai');
    loadingMsg.textContent = 'Thinking...';
    loadingMsg.id = 'loadingMsg';
    chatMessages.appendChild(loadingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const data = await apiRequest('/ai/chat', 'POST', { prompt }, true);
        document.getElementById('loadingMsg').remove();
        addMessage(data.response, 'ai');
    } catch (error) {
        document.getElementById('loadingMsg').remove();
        addMessage('Sorry, something went wrong: ' + error.message, 'ai');
    }
});