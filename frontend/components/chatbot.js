// =============================================
// CHATBOT SCRIPT - LAG VINTAGE SHOP
// Tích hợp Google Gemini AI
// =============================================

// API URL configuration
const API_BASE_URL = window.location.port === '5500' 
    ? 'http://localhost:3000/api'  // Live Server
    : '/api';                        // Production/Normal server

// Đợi DOM load xong mới khởi tạo chatbot
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    // DOM đã sẵn sàng, khởi tạo ngay
    initChatbot();
}

function initChatbot() {
    let sessionId = null;
    let isWaitingResponse = false;

    // Khởi tạo sessionId
    function initSession() {
        sessionId = localStorage.getItem('chatbot_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatbot_session_id', sessionId);
        }
    }

    initSession();

    // Toggle chatbot window
    document.addEventListener('click', (e) => {
        if (e.target.closest('.chatbot-toggle')) {
            const chatbotWindow = document.querySelector('.chatbot-window');
            chatbotWindow.classList.toggle('hidden');
            
            if (!chatbotWindow.classList.contains('hidden')) {
                const input = document.querySelector('.chatbot-input input');
                input?.focus();
                
                // Load gợi ý nếu chưa có tin nhắn
                const messages = document.querySelectorAll('.message');
                if (messages.length === 1) { // Chỉ có tin nhắn welcome
                    loadSuggestions();
                }
            }
        }

        if (e.target.closest('.chatbot-close')) {
            document.querySelector('.chatbot-window').classList.add('hidden');
        }
    });

    // Load gợi ý câu hỏi
    async function loadSuggestions() {
        try {
            const response = await fetch(`${API_BASE_URL}/chatbot/suggestions`);
            const result = await response.json();
            
            if (result.success && result.data) {
                const messagesContainer = document.querySelector('.chatbot-messages');
                const imgUrl = window.location.port === '5500' 
                    ? 'http://localhost:3000/images/chatbot.png'
                    : '/images/chatbot.png';
                const imgFallback = window.location.port === '5500'
                    ? 'http://localhost:3000/images/chatbot-icon.svg'
                    : '/images/chatbot-icon.svg';
                    
                const suggestionsHTML = `
                    <div class="message bot-message">
                        <img src="${imgUrl}" 
                             onerror="this.onerror=null; this.src='${imgFallback}'" 
                             alt="Bot" 
                             class="message-avatar">
                        <div class="message-content">
                            <p>Bạn có thể hỏi tôi những câu hỏi như:</p>
                            <div class="suggestions">
                                ${result.data.map(s => `<button class="suggestion-btn">${s}</button>`).join('')}
                            </div>
                        </div>
                    </div>
                `;
                messagesContainer.insertAdjacentHTML('beforeend', suggestionsHTML);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        } catch (error) {
            console.error('Error loading suggestions:', error);
        }
    }

    // Xử lý click vào gợi ý
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-btn')) {
            const message = e.target.textContent;
            const input = document.querySelector('.chatbot-input input');
            input.value = message;
            sendMessage();
        }
    });

    // Gửi tin nhắn
    async function sendMessage() {
        const input = document.querySelector('.chatbot-input input');
        const message = input.value.trim();

        if (!message || isWaitingResponse) return;

        // Thêm tin nhắn người dùng
        addMessage(message, 'user');
        input.value = '';

        // Hiển thị typing indicator
        showTypingIndicator();
        isWaitingResponse = true;

        try {
            const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: sessionId
                })
            });

            const result = await response.json();

            // Xóa typing indicator
            removeTypingIndicator();
            isWaitingResponse = false;

            if (result.success) {
                addMessage(result.data.message, 'bot');
            } else {
                addMessage('Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau! 😔', 'bot');
            }

        } catch (error) {
            console.error('Chatbot error:', error);
            removeTypingIndicator();
            isWaitingResponse = false;
            addMessage('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng! 🔌', 'bot');
        }
    }

    // Thêm tin nhắn vào giao diện
    function addMessage(message, type) {
        const messagesContainer = document.querySelector('.chatbot-messages');
        const imgUrl = window.location.port === '5500' 
            ? 'http://localhost:3000/images/chatbot.png'
            : '/images/chatbot.png';
        const imgFallback = window.location.port === '5500'
            ? 'http://localhost:3000/images/chatbot-icon.svg'
            : '/images/chatbot-icon.svg';
            
        const messageHTML = type === 'user' 
            ? `
                <div class="message user-message">
                    <div class="message-content">
                        <p>${escapeHtml(message)}</p>
                    </div>
                </div>
            `
            : `
                <div class="message bot-message">
                    <img src="${imgUrl}" 
                         onerror="this.onerror=null; this.src='${imgFallback}'" 
                         alt="Bot" 
                         class="message-avatar">
                    <div class="message-content">
                        ${formatBotMessage(message)}
                    </div>
                </div>
            `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Format tin nhắn bot (hỗ trợ markdown đơn giản)
    function formatBotMessage(message) {
        // Convert line breaks
        let formatted = message.replace(/\n/g, '<br>');
        
        // Convert **bold**
        formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Convert *italic*
        formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Convert links
        formatted = formatted.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        return `<p>${formatted}</p>`;
    }

    // Escape HTML để tránh XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Hiển thị typing indicator
    function showTypingIndicator() {
        const messagesContainer = document.querySelector('.chatbot-messages');
        const imgUrl = window.location.port === '5500' 
            ? 'http://localhost:3000/images/chatbot.png'
            : '/images/chatbot.png';
        const imgFallback = window.location.port === '5500'
            ? 'http://localhost:3000/images/chatbot-icon.svg'
            : '/images/chatbot-icon.svg';
            
        const typingHTML = `
            <div class="message bot-message typing-indicator">
                <img src="${imgUrl}" 
                     onerror="this.onerror=null; this.src='${imgFallback}'" 
                     alt="Bot" 
                     class="message-avatar">
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Xóa typing indicator
    function removeTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Gửi tin nhắn khi nhấn nút
    const btnSend = document.querySelector('.btn-send');
    if (btnSend) {
        btnSend.addEventListener('click', sendMessage);
    }

    // Gửi tin nhắn khi nhấn Enter
    const chatInput = document.querySelector('.chatbot-input input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}
