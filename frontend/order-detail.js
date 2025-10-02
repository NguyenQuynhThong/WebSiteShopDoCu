// ============================================
// ORDER DETAIL PAGE - LAG VINTAGE SHOP
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';
const SERVER_URL = 'http://localhost:3000';

let userId = localStorage.getItem('userId') || null;
let orderId = null;
let orderData = null;

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check login
    if (!userId) {
        alert('Vui lòng đăng nhập để xem đơn hàng');
        window.location.href = 'login.html';
        return;
    }
    
    // Get order_id from URL
    const urlParams = new URLSearchParams(window.location.search);
    orderId = urlParams.get('order_id');
    
    if (!orderId) {
        alert('Không tìm thấy mã đơn hàng');
        window.location.href = 'index.html';
        return;
    }
    
    loadOrderDetail();
});

// ============================================
// Load Order Detail
// ============================================
async function loadOrderDetail() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
            orderData = data.order;
            displayOrderDetail(data.order, data.items, data.payment, data.qr);
        } else {
            alert(data.message || 'Không thể tải thông tin đơn hàng');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Load order detail error:', error);
        alert('Có lỗi xảy ra khi tải đơn hàng');
        window.location.href = 'index.html';
    }
}

// ============================================
// Display Order Detail
// ============================================
function displayOrderDetail(order, items, payment, qr) {
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('orderContent').style.display = 'block';
    
    // Order header
    document.getElementById('orderCode').textContent = `Mã đơn hàng: #${order.order_code}`;
    
    // Order status
    displayOrderStatus(order.order_status);
    
    // Payment status
    displayPaymentStatus(order.payment_status);
    
    // Order items
    displayOrderItems(items);
    
    // Customer info
    displayCustomerInfo(order);
    
    // Order summary
    displayOrderSummary(order);
    
    // Order timeline
    displayTimeline(order);
    
    // Payment info (if bank transfer)
    if (order.payment_method === 'bank_transfer' || order.payment_method === 'bank') {
        displayPaymentInfo(order, payment, qr);
    }
    
    // Action buttons
    setupActionButtons(order);
}

// ============================================
// Display Order Status
// ============================================
function displayOrderStatus(status) {
    const statusElement = document.getElementById('orderStatus');
    const statusMap = {
        'pending': { text: '⏳ Chờ xác nhận', class: 'pending' },
        'processing': { text: '📦 Đang xử lý', class: 'processing' },
        'shipping': { text: '🚚 Đang giao hàng', class: 'shipping' },
        'delivered': { text: '✅ Đã giao hàng', class: 'delivered' },
        'cancelled': { text: '❌ Đã hủy', class: 'cancelled' }
    };
    
    const statusInfo = statusMap[status] || statusMap['pending'];
    statusElement.textContent = statusInfo.text;
    statusElement.className = `status-badge ${statusInfo.class}`;
}

// ============================================
// Display Payment Status
// ============================================
function displayPaymentStatus(status) {
    const statusElement = document.getElementById('paymentStatus');
    const statusMap = {
        'pending': { text: '💳 Chưa thanh toán', class: 'pending' },
        'paid': { text: '✅ Đã thanh toán', class: 'paid' },
        'failed': { text: '❌ Thanh toán thất bại', class: 'cancelled' }
    };
    
    const statusInfo = statusMap[status] || statusMap['pending'];
    statusElement.textContent = statusInfo.text;
    statusElement.className = `status-badge ${statusInfo.class}`;
}

// ============================================
// Display Order Items
// ============================================
function displayOrderItems(items) {
    const container = document.getElementById('orderItems');
    
    if (!items || items.length === 0) {
        container.innerHTML = '<p>Không có sản phẩm nào</p>';
        return;
    }
    
    container.innerHTML = items.map(item => {
        let imageUrl = item.image || '/images/placeholder.svg';
        if (imageUrl.startsWith('/')) {
            imageUrl = SERVER_URL + imageUrl;
        }
        
        // Tính toán giá trị an toàn
        const price = item.price || 0;
        const quantity = item.quantity || 1;
        const subtotal = item.subtotal || (price * quantity);
        
        return `
            <div class="order-item">
                <img src="${imageUrl}" alt="${item.product_name || 'Sản phẩm'}">
                <div class="order-item-info">
                    <div class="order-item-name">${item.product_name || 'Sản phẩm'}</div>
                    <div class="order-item-price">${formatPrice(price)}₫ / sản phẩm</div>
                    <div class="order-item-quantity">Số lượng: ${quantity}</div>
                </div>
                <div class="order-item-subtotal">
                    ${formatPrice(subtotal)}₫
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// Display Customer Info
// ============================================
function displayCustomerInfo(order) {
    const container = document.getElementById('customerInfo');
    
    container.innerHTML = `
        <p><strong>Họ tên:</strong> ${order.customer_name}</p>
        <p><strong>Email:</strong> ${order.customer_email}</p>
        <p><strong>Số điện thoại:</strong> ${order.customer_phone}</p>
        <p><strong>Địa chỉ:</strong> ${order.shipping_address}</p>
        <p><strong>Quận/Huyện:</strong> ${order.shipping_district}</p>
        <p><strong>Thành phố:</strong> ${order.shipping_city}</p>
        ${order.notes ? `<p><strong>Ghi chú:</strong> ${order.notes}</p>` : ''}
    `;
}

// ============================================
// Display Order Summary
// ============================================
function displayOrderSummary(order) {
    document.getElementById('orderDate').textContent = formatDate(order.created_at);
    
    const paymentMethodMap = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'bank_transfer': 'Chuyển khoản ngân hàng',
        'bank': 'Chuyển khoản ngân hàng'
    };
    document.getElementById('paymentMethod').textContent = paymentMethodMap[order.payment_method] || order.payment_method;
    
    document.getElementById('subtotal').textContent = formatPrice(order.subtotal) + '₫';
    document.getElementById('shippingFee').textContent = formatPrice(order.shipping_fee) + '₫';
    document.getElementById('totalAmount').textContent = formatPrice(order.total_amount) + '₫';
}

// ============================================
// Display Timeline
// ============================================
function displayTimeline(order) {
    const container = document.getElementById('orderTimeline');
    
    const timeline = [
        {
            title: 'Đơn hàng đã được đặt',
            desc: 'Đơn hàng của bạn đã được tạo thành công',
            date: formatDate(order.created_at),
            active: true
        },
        {
            title: 'Đã xác nhận đơn hàng',
            desc: 'Người bán đã xác nhận đơn hàng',
            date: order.order_status !== 'pending' ? formatDate(order.updated_at) : null,
            active: order.order_status !== 'pending'
        },
        {
            title: 'Đang chuẩn bị hàng',
            desc: 'Đơn hàng đang được đóng gói',
            date: order.order_status === 'processing' || order.order_status === 'shipping' || order.order_status === 'delivered' ? formatDate(order.updated_at) : null,
            active: order.order_status === 'processing' || order.order_status === 'shipping' || order.order_status === 'delivered'
        },
        {
            title: 'Đang giao hàng',
            desc: 'Đơn hàng đang trên đường giao đến bạn',
            date: order.order_status === 'shipping' || order.order_status === 'delivered' ? formatDate(order.updated_at) : null,
            active: order.order_status === 'shipping' || order.order_status === 'delivered'
        },
        {
            title: 'Đã giao hàng',
            desc: 'Đơn hàng đã được giao thành công',
            date: order.order_status === 'delivered' ? formatDate(order.updated_at) : null,
            active: order.order_status === 'delivered'
        }
    ];
    
    // If cancelled, show cancelled status
    if (order.order_status === 'cancelled') {
        timeline.push({
            title: '❌ Đơn hàng đã bị hủy',
            desc: 'Đơn hàng đã được hủy',
            date: formatDate(order.updated_at),
            active: true
        });
    }
    
    container.innerHTML = timeline.map(item => `
        <div class="timeline-item ${item.active ? '' : 'inactive'}">
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-desc">${item.desc}</div>
            ${item.date ? `<div class="timeline-date">${item.date}</div>` : ''}
        </div>
    `).join('');
}

// ============================================
// Display Payment Info
// ============================================
function displayPaymentInfo(order, payment, qr) {
    if (order.payment_status === 'paid') {
        return; // Đã thanh toán rồi thì không cần hiển thị
    }
    
    const section = document.getElementById('paymentInfoSection');
    const container = document.getElementById('paymentInfo');
    
    section.style.display = 'block';
    
    let content = `
        <div style="text-align: center; margin-bottom: 15px;">
            <p style="color: #666; margin-bottom: 10px;">Quét mã QR để thanh toán</p>
    `;
    
    if (qr && (qr.qrUrl || qr.qr_url)) {
        const qrUrl = qr.qrUrl || qr.qr_url;
        content += `<img src="${qrUrl}" style="max-width: 200px; border: 2px solid #ddd; border-radius: 8px;">`;
    }
    
    content += `
        </div>
        <div style="font-size: 13px; color: #666; line-height: 1.6;">
            <p><strong>Ngân hàng:</strong> Vietcombank (VCB)</p>
            <p><strong>Số tài khoản:</strong> 0335060370</p>
            <p><strong>Chủ tài khoản:</strong> NGUYEN QUYNH THONG</p>
            <p><strong>Nội dung:</strong> ${order.order_code}</p>
            <p><strong>Số tiền:</strong> ${formatPrice(order.total_amount)}₫</p>
        </div>
        <button class="btn btn-primary" style="width: 100%; margin-top: 15px;" onclick="checkPayment()">
            Kiểm tra thanh toán
        </button>
    `;
    
    container.innerHTML = content;
}

// ============================================
// Setup Action Buttons
// ============================================
function setupActionButtons(order) {
    // Cancel button - only show if order is pending
    const cancelBtn = document.getElementById('cancelOrderBtn');
    if (order.order_status === 'pending') {
        cancelBtn.style.display = 'inline-block';
        cancelBtn.onclick = () => cancelOrder(order.order_id);
    }
    
    // Track order button - show if shipping
    const trackBtn = document.getElementById('trackOrderBtn');
    if (order.order_status === 'shipping') {
        trackBtn.style.display = 'inline-block';
    }
    
    // Reorder button
    document.getElementById('reorderBtn').onclick = () => reorder(order.order_id);
}

// ============================================
// Cancel Order
// ============================================
async function cancelOrder(orderId) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Đơn hàng đã được hủy thành công');
            location.reload();
        } else {
            alert(data.message || 'Không thể hủy đơn hàng');
        }
    } catch (error) {
        console.error('Cancel order error:', error);
        alert('Có lỗi xảy ra khi hủy đơn hàng');
    }
}

// ============================================
// Check Payment
// ============================================
async function checkPayment() {
    try {
        const btn = event.target;
        btn.disabled = true;
        btn.textContent = 'Đang kiểm tra...';
        
        const response = await fetch(`${API_BASE_URL}/payments/status/${orderId}`);
        const data = await response.json();
        
        if (data.success) {
            if (data.payment.status === 'paid') {
                alert('✅ Thanh toán thành công!');
                location.reload();
            } else {
                alert('Chưa nhận được thanh toán. Vui lòng thử lại sau.');
                btn.disabled = false;
                btn.textContent = 'Kiểm tra thanh toán';
            }
        } else {
            alert(data.message || 'Không thể kiểm tra trạng thái thanh toán');
            btn.disabled = false;
            btn.textContent = 'Kiểm tra thanh toán';
        }
    } catch (error) {
        console.error('Check payment error:', error);
        alert('Có lỗi xảy ra khi kiểm tra thanh toán');
        event.target.disabled = false;
        event.target.textContent = 'Kiểm tra thanh toán';
    }
}

// ============================================
// Reorder
// ============================================
async function reorder(orderId) {
    if (!confirm('Bạn có muốn đặt lại đơn hàng này?')) {
        return;
    }
    
    try {
        // Get order items
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}?userId=${userId}`);
        const data = await response.json();
        
        if (data.success && data.items) {
            // Add all items to cart
            for (const item of data.items) {
                await fetch(`${API_BASE_URL}/cart/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: userId,
                        productId: item.product_id,
                        quantity: item.quantity
                    })
                });
            }
            
            alert('✅ Đã thêm sản phẩm vào giỏ hàng');
            window.location.href = 'cart.html';
        } else {
            alert('Không thể đặt lại đơn hàng');
        }
    } catch (error) {
        console.error('Reorder error:', error);
        alert('Có lỗi xảy ra khi đặt lại đơn hàng');
    }
}

// ============================================
// Utility Functions
// ============================================
function formatPrice(price) {
    if (price === null || price === undefined || isNaN(price)) {
        return '0';
    }
    return parseFloat(price).toLocaleString('vi-VN');
}

function formatDate(dateString) {
    if (!dateString) {
        return 'Chưa cập nhật';
    }
    
    const date = new Date(dateString);
    
    // Kiểm tra date hợp lệ
    if (isNaN(date.getTime())) {
        return 'Chưa cập nhật';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
