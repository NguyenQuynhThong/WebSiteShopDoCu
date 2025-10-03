// ============================================
// LOGIN PAGE - LAG VINTAGE SHOP
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const loginForm = document.querySelector('.auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// ============================================
// Handle Login
// ============================================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Validation
    if (!email || !password) {
        showMessage('Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Save user data and token to localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userId', data.user.userId);
            localStorage.setItem('token', data.token); // Save JWT token
            
            // Merge cart if there's a session cart (only for customers)
            if (data.user.role !== 'admin') {
                const sessionId = localStorage.getItem('sessionId');
                if (sessionId) {
                    await mergeCart(sessionId, data.user.userId);
                    localStorage.removeItem('sessionId');
                }
            }
            
            showMessage('Đăng nhập thành công!', 'success');
            
            // Redirect based on user role
            setTimeout(() => {
                if (data.user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1000);
        } else {
            showMessage(data.message || 'Đăng nhập thất bại', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Có lỗi xảy ra, vui lòng thử lại', 'error');
    }
});

// ============================================
// Merge Cart
// ============================================
async function mergeCart(sessionId, userId) {
    try {
        await fetch(`${API_BASE_URL}/cart/merge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId, userId })
        });
    } catch (error) {
        console.error('Merge cart error:', error);
    }
}

// ============================================
// Show Message
// ============================================
function showMessage(message, type = 'info') {
    // Remove existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    
    // Insert before form
    const authBox = document.querySelector('.auth-box');
    authBox.insertBefore(messageDiv, authBox.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// ============================================
// Check if already logged in
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem('user');
    if (user) {
        // Already logged in, redirect to home
        window.location.href = 'index.html';
    }
});
