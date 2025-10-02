// ============================================
// CART PAGE - LAG VINTAGE SHOP
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';
const SERVER_URL = 'http://localhost:3000'; // Base URL for images

// Chỉ sử dụng userId - yêu cầu đăng nhập
let userId = localStorage.getItem('userId') || null;
let currentCart = []; // Lưu trữ giỏ hàng hiện tại

// Kiểm tra đăng nhập ngay khi load trang
if (!userId) {
    window.location.href = 'login.html';
}

// ============================================
// Load Cart on Page Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

// ============================================
// Load Cart Items
// ============================================
async function loadCart() {
    try {
        showLoading();
        
        const response = await fetch(
            `${API_BASE_URL}/cart?userId=${userId}`
        );
        
        const data = await response.json();
        
        hideLoading();
        
        if (data.success) {
            displayCart(data.cart, data.summary);
        } else {
            if (data.requireLogin) {
                window.location.href = 'login.html';
            } else {
                showEmptyCart();
            }
        }
    } catch (error) {
        console.error('Load cart error:', error);
        hideLoading();
        showError('Không thể tải giỏ hàng. Vui lòng thử lại!');
    }
}

// ============================================
// Display Cart Items
// ============================================
function displayCart(cartItems, summary) {
    // Lưu giỏ hàng hiện tại
    currentCart = cartItems;
    
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (cartItems.length === 0) {
        showEmptyCart();
        return;
    }
    
    // Display cart items
    cartItemsContainer.innerHTML = cartItems.map(item => {
        // Process image URL
        let imageUrl = item.image || '/images/placeholder.jpg';
        if (imageUrl.startsWith('/')) {
            imageUrl = SERVER_URL + imageUrl; // Convert to absolute URL
        }
        
        return `
        <div class="cart-item" data-cart-id="${item.cart_id}">
            <div class="item-image">
                <img src="${imageUrl}" 
                     alt="${item.name}"
                     onerror="this.src='${SERVER_URL}/images/placeholder.jpg'">
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-desc">Còn lại: ${item.stock} sản phẩm</p>
                <p class="item-price">${formatPrice(item.price)}₫</p>
            </div>
            <div class="item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.cart_id}, ${item.quantity - 1})">-</button>
                <input type="number" value="${item.quantity}" min="1" max="${item.stock}" 
                       onchange="updateQuantity(${item.cart_id}, this.value)">
                <button class="qty-btn" onclick="updateQuantity(${item.cart_id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="item-total">
                <p class="total-price">${formatPrice(item.subtotal)}₫</p>
                <button class="btn-remove" onclick="removeItem(${item.cart_id})">Xóa</button>
            </div>
        </div>
        `;
    }).join('');
    
    // Update summary
    updateSummary(summary);
}

// ============================================
// Update Summary
// ============================================
function updateSummary(summary) {
    const totalItems = summary.totalItems || 0;
    const subtotal = parseFloat(summary.total) || 0;
    const shipping = subtotal > 0 ? 50000 : 0; // Free ship nếu > 500k
    const discount = 0; // Tính discount nếu có
    const total = subtotal + shipping - discount;
    
    document.querySelector('.cart-summary').innerHTML = `
        <h3>Tóm Tắt Đơn Hàng</h3>
        
        <div class="summary-row">
            <span>Số lượng sản phẩm:</span>
            <span>${totalItems}</span>
        </div>
        
        <div class="summary-row">
            <span>Tạm tính:</span>
            <span>${formatPrice(subtotal)}₫</span>
        </div>

        <div class="summary-row">
            <span>Phí vận chuyển:</span>
            <span>${formatPrice(shipping)}₫</span>
        </div>

        ${discount > 0 ? `
        <div class="summary-row discount">
            <span>Giảm giá:</span>
            <span>-${formatPrice(discount)}₫</span>
        </div>
        ` : ''}

        <div class="summary-divider"></div>

        <div class="summary-row total">
            <strong>Tổng cộng:</strong>
            <strong class="total-amount">${formatPrice(total)}₫</strong>
        </div>

        <button class="btn-checkout" onclick="checkout()">Thanh Toán</button>
        <button class="btn-continue" onclick="window.location.href='products.html'">Tiếp Tục Mua Sắm</button>
    `;
    
    // Update cart count in header
    updateCartCount(totalItems);
}

// ============================================
// Update Quantity
// ============================================
async function updateQuantity(cartId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    
    if (newQuantity < 1) {
        removeItem(cartId);
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/cart/update/${cartId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: newQuantity,
                userId: userId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadCart(); // Reload cart
            showNotification('Đã cập nhật số lượng', 'success');
        } else {
            showNotification(data.message, 'error');
            loadCart(); // Reload to reset
        }
    } catch (error) {
        console.error('Update quantity error:', error);
        showNotification('Không thể cập nhật số lượng', 'error');
    }
}

// ============================================
// Remove Item
// ============================================
async function removeItem(cartId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    
    try {
        const response = await fetch(
            `${API_BASE_URL}/cart/remove/${cartId}?userId=${userId}`,
            { method: 'DELETE' }
        );
        
        const data = await response.json();
        
        if (data.success) {
            loadCart(); // Reload cart
            showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Remove item error:', error);
        showNotification('Không thể xóa sản phẩm', 'error');
    }
}

// ============================================
// Clear Cart
// ============================================
async function clearCart() {
    if (!confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
        return;
    }
    
    try {
        const response = await fetch(
            `${API_BASE_URL}/cart/clear?userId=${userId}`,
            { method: 'DELETE' }
        );
        
        const data = await response.json();
        
        if (data.success) {
            loadCart();
            showNotification('Đã xóa toàn bộ giỏ hàng', 'success');
        } else {
            showNotification(data.message, 'error');
        }
    } catch (error) {
        console.error('Clear cart error:', error);
        showNotification('Không thể xóa giỏ hàng', 'error');
    }
}

// ============================================
// Checkout
// ============================================
function checkout() {
    const user = localStorage.getItem('user');
    
    if (!user) {
        // Redirect to login
        if (confirm('Bạn cần đăng nhập để thanh toán. Chuyển đến trang đăng nhập?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    
    // Kiểm tra giỏ hàng có sản phẩm không
    if (!currentCart || currentCart.length === 0) {
        showNotification('Giỏ hàng trống, vui lòng thêm sản phẩm', 'error');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// ============================================
// Show Empty Cart
// ============================================
function showEmptyCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    cartItemsContainer.innerHTML = `
        <div class="empty-cart">
            <div class="empty-icon">🛒</div>
            <h3>Giỏ hàng trống</h3>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
            <button class="btn-primary" onclick="window.location.href='products.html'">
                Khám phá sản phẩm
            </button>
        </div>
    `;
    
    cartSummary.innerHTML = `
        <h3>Tóm Tắt Đơn Hàng</h3>
        <p style="text-align: center; color: #999; padding: 20px;">
            Chưa có sản phẩm
        </p>
    `;
    
    updateCartCount(0);
}

// ============================================
// Update Cart Count in Header
// ============================================
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = count;
    });
    localStorage.setItem('cartCount', count);
}

// ============================================
// Utility Functions
// ============================================
function showLoading() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Đang tải giỏ hàng...</p>
        </div>
    `;
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

function showError(message) {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = `
        <div class="error-message">
            <p>❌ ${message}</p>
            <button class="btn-primary" onclick="loadCart()">Thử lại</button>
        </div>
    `;
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function formatPrice(price) {
    return parseFloat(price).toLocaleString('vi-VN');
}
