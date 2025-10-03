// =============================================
// CONTACT FORM - LAG VINTAGE SHOP
// =============================================
// Xử lý form liên hệ
// =============================================

const API_URL = 'http://localhost:3000/api';

// Xử lý submit form liên hệ
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// Hàm xử lý submit form
async function handleContactSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    
    try {
        // Lấy dữ liệu từ form
        const formData = {
            first_name: document.getElementById('first_name').value.trim(),
            last_name: document.getElementById('last_name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim(),
            subscribe_newsletter: document.getElementById('subscribe_newsletter').checked
        };
        
        // Validate
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.subject || !formData.message) {
            showNotification('error', 'Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('error', 'Email không hợp lệ!');
            return;
        }
        
        // Validate subject
        if (!formData.subject) {
            showNotification('error', 'Vui lòng chọn chủ đề!');
            return;
        }
        
        // Hiển thị loading
        submitBtn.textContent = 'Đang gửi...';
        submitBtn.disabled = true;
        
        // Gửi request
        const response = await fetch(`${API_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            showNotification('success', data.message || 'Gửi tin nhắn thành công!');
            
            // Reset form
            e.target.reset();
            
            // Hiển thị thông báo cảm ơn
            showThankYouMessage();
        } else {
            showNotification('error', data.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
        }
        
    } catch (error) {
        console.error('Error submitting contact:', error);
        showNotification('error', 'Không thể kết nối đến server. Vui lòng thử lại sau!');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Hiển thị thông báo
function showNotification(type, message) {
    // Xóa notification cũ nếu có
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Tạo notification mới
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Hiển thị notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Tự động ẩn sau 5 giây
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Hiển thị thông báo cảm ơn
function showThankYouMessage() {
    const contactForm = document.querySelector('.contact-form-wrapper');
    
    if (contactForm) {
        // Tạo thank you message
        const thankYouDiv = document.createElement('div');
        thankYouDiv.className = 'thank-you-message';
        thankYouDiv.innerHTML = `
            <div class="thank-you-content">
                <div class="thank-you-icon">✓</div>
                <h3>Cảm ơn bạn đã liên hệ!</h3>
                <p>Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>
                <p class="thank-you-note">Thời gian phản hồi: 24-48 giờ làm việc</p>
                <button class="btn-submit" onclick="location.reload()">Gửi tin nhắn khác</button>
            </div>
        `;
        
        // Ẩn form và hiển thị thank you message
        contactForm.style.display = 'none';
        contactForm.parentNode.appendChild(thankYouDiv);
        
        // Cuộn đến message
        thankYouDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// CSS cho notification (thêm vào style.css hoặc inline)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
    }
    
    .notification-success .notification-icon {
        background: #10b981;
        color: white;
    }
    
    .notification-error .notification-icon {
        background: #ef4444;
        color: white;
    }
    
    .notification-message {
        flex: 1;
        font-size: 14px;
        color: #333;
    }
    
    .thank-you-message {
        background: white;
        border-radius: 12px;
        padding: 40px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .thank-you-icon {
        width: 80px;
        height: 80px;
        background: #10b981;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        margin: 0 auto 20px;
        animation: scaleIn 0.5s ease;
    }
    
    .thank-you-content h3 {
        color: #1f2937;
        margin-bottom: 15px;
        font-size: 24px;
    }
    
    .thank-you-content p {
        color: #6b7280;
        margin-bottom: 10px;
        line-height: 1.6;
    }
    
    .thank-you-note {
        color: #9ca3af;
        font-size: 14px;
        font-style: italic;
    }
    
    .thank-you-content .btn-submit {
        margin-top: 20px;
    }
    
    @keyframes scaleIn {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }
`;

// Thêm styles vào head
const styleElement = document.createElement('style');
styleElement.textContent = notificationStyles;
document.head.appendChild(styleElement);
