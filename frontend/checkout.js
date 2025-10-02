// ============================================
// CHECKOUT PAGE - LAG VINTAGE SHOP
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';
const SERVER_URL = 'http://localhost:3000';

let userId = localStorage.getItem('userId') || null;
let cartData = null;

// Kiểm tra đăng nhập
if (!userId) {
    alert('Vui lòng đăng nhập để thanh toán');
    window.location.href = 'login.html';
}

// ============================================
// Load cart data
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    await loadCartData();
    setupPaymentMethods();
    setupForm();
});

// ============================================
// Load Cart Data
// ============================================
async function loadCartData() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart?userId=${userId}`);
        const data = await response.json();
        
        if (data.success && data.cart.length > 0) {
            cartData = data;
            displayCartSummary(data.cart, data.summary);
            
            // Pre-fill user info
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                document.getElementById('customerName').value = user.username || '';
                document.getElementById('customerEmail').value = user.email || '';
            }
        } else {
            alert('Giỏ hàng trống!');
            window.location.href = 'cart.html';
        }
    } catch (error) {
        console.error('Load cart error:', error);
        alert('Không thể tải giỏ hàng');
    }
}

// ============================================
// Display Cart Summary
// ============================================
function displayCartSummary(cart, summary) {
    const summaryItems = document.getElementById('summaryItems');
    
    summaryItems.innerHTML = cart.map(item => {
        let imageUrl = item.image || '/images/placeholder.jpg';
        if (imageUrl.startsWith('/')) {
            imageUrl = SERVER_URL + imageUrl;
        }
        
        return `
            <div class="summary-item">
                <img src="${imageUrl}" alt="${item.name}">
                <div class="summary-item-info">
                    <div class="summary-item-name">${item.name}</div>
                    <div class="summary-item-price">
                        ${formatPrice(item.price)}₫ x ${item.quantity}
                    </div>
                </div>
                <div style="font-weight: 500;">
                    ${formatPrice(item.subtotal)}₫
                </div>
            </div>
        `;
    }).join('');
    
    const subtotal = parseFloat(summary.total);
    const shipping = 50000;
    const total = subtotal + shipping;
    
    document.getElementById('subtotalAmount').textContent = formatPrice(subtotal) + '₫';
    document.getElementById('shippingFee').textContent = formatPrice(shipping) + '₫';
    document.getElementById('totalAmount').textContent = formatPrice(total) + '₫';
}

// ============================================
// Setup Payment Methods
// ============================================
function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const paymentMethodInput = document.getElementById('paymentMethod');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            paymentMethodInput.value = method.dataset.method;
        });
    });
}

// ============================================
// Setup Form Submit
// ============================================
function setupForm() {
    const form = document.getElementById('checkoutForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await processCheckout();
    });
}

// ============================================
// Process Checkout
// ============================================
async function processCheckout() {
    try {
        const subtotal = parseFloat(cartData.summary.total);
        const shipping = 50000;
        const total = subtotal + shipping;
        
        const orderData = {
            customer_name: document.getElementById('customerName').value,
            customer_email: document.getElementById('customerEmail').value,
            customer_phone: document.getElementById('customerPhone').value,
            shipping_address: document.getElementById('shippingAddress').value,
            shipping_district: document.getElementById('shippingDistrict').value,
            shipping_city: document.getElementById('shippingCity').value,
            payment_method: document.getElementById('paymentMethod').value,
            subtotal: subtotal,
            shipping_fee: shipping,
            total_amount: total,
            notes: document.getElementById('orderNotes').value
        };
        
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/orders/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: userId,
                orderData: orderData
            })
        });
        
        const data = await response.json();
        
        hideLoading();
        
        if (data.success) {
            // Lưu order info
            localStorage.setItem('lastOrder', JSON.stringify({
                order_id: data.order.order_id,
                order_code: data.order.order_code,
                total_amount: data.order.total_amount,
                qr: data.qr
            }));
            
            // Redirect đến trang payment
            window.location.href = `payment.html?order_id=${data.order.order_id}`;
        } else {
            alert(data.message || 'Không thể tạo đơn hàng');
        }
    } catch (error) {
        hideLoading();
        console.error('Checkout error:', error);
        alert('Có lỗi xảy ra, vui lòng thử lại');
    }
}

// ============================================
// Utility Functions
// ============================================
function showLoading() {
    const btn = document.querySelector('.btn-checkout');
    btn.disabled = true;
    btn.textContent = 'Đang xử lý...';
}

function hideLoading() {
    const btn = document.querySelector('.btn-checkout');
    btn.disabled = false;
    btn.textContent = 'Đặt hàng';
}

function formatPrice(price) {
    return parseFloat(price).toLocaleString('vi-VN');
}
