// ============================================
// PAYMENT PAGE - LAG VINTAGE SHOP
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';
let orderId = null;
let orderData = null;
let checkInterval = null;

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Lấy order_id từ URL
    const urlParams = new URLSearchParams(window.location.search);
    orderId = urlParams.get('order_id');
    
    if (!orderId) {
        // Thử lấy từ localStorage
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
            const order = JSON.parse(lastOrder);
            orderId = order.order_id;
        } else {
            alert('Không tìm thấy thông tin đơn hàng');
            window.location.href = 'index.html';
            return;
        }
    }
    
    loadOrderData();
});

// ============================================
// Load Order Data
// ============================================
async function loadOrderData() {
    try {
        const userId = localStorage.getItem('userId');
        
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
            orderData = data.order;
            displayOrderData(data.order, data.qr);
            
            // Nếu chưa thanh toán và là bank transfer, tự động check
            if (data.order.payment_status === 'pending' && data.order.payment_method === 'bank_transfer') {
                startPaymentCheck();
            }
        } else {
            alert(data.message || 'Không thể tải thông tin đơn hàng');
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Load order error:', error);
        alert('Có lỗi xảy ra khi tải đơn hàng');
    }
}

// ============================================
// Display Order Data
// ============================================
function displayOrderData(order, qr) {
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('orderCode').textContent = `Mã đơn hàng: #${order.order_code}`;
    
    // Update payment status
    const statusElement = document.getElementById('paymentStatus');
    if (order.payment_status === 'paid') {
        statusElement.textContent = 'Đã thanh toán';
        statusElement.className = 'payment-status paid';
    } else {
        statusElement.textContent = 'Chờ thanh toán';
        statusElement.className = 'payment-status pending';
    }
    
    // Hiển thị theo phương thức thanh toán
    if (order.payment_method === 'bank_transfer' || order.payment_method === 'bank') {
        displayBankTransfer(order, qr);
    } else if (order.payment_method === 'cod') {
        displayCOD(order);
    }
    
    // Show buttons
    if (order.payment_status === 'pending' && (order.payment_method === 'bank_transfer' || order.payment_method === 'bank')) {
        document.getElementById('checkPaymentBtn').style.display = 'inline-block';
    }
    
    document.getElementById('viewOrderBtn').style.display = 'inline-block';
}

// ============================================
// Display Bank Transfer
// ============================================
function displayBankTransfer(order, qr) {
    document.getElementById('bankTransferSection').style.display = 'block';
    
    // QR Code
    console.log('QR Data:', qr); // Debug log
    if (qr) {
        const qrUrl = qr.qrUrl || qr.qr_url;
        if (qrUrl) {
            console.log('Setting QR URL:', qrUrl); // Debug log
            document.getElementById('qrImage').src = qrUrl;
        } else {
            console.error('QR URL not found in:', qr);
        }
    } else {
        console.error('No QR data received');
    }
    
    // Order info
    document.getElementById('orderCodeDisplay').textContent = `#${order.order_code}`;
    document.getElementById('subtotalDisplay').textContent = formatPrice(order.subtotal) + '₫';
    document.getElementById('shippingDisplay').textContent = formatPrice(order.shipping_fee) + '₫';
    document.getElementById('totalDisplay').textContent = formatPrice(order.total_amount) + '₫';
    
    // Transfer content
    document.getElementById('transferContent').textContent = order.order_code;
    
    // Setup check payment button
    document.getElementById('checkPaymentBtn').addEventListener('click', checkPaymentStatus);
}

// ============================================
// Display COD
// ============================================
function displayCOD(order) {
    document.getElementById('codSection').style.display = 'block';
    
    document.getElementById('codAmount').textContent = formatPrice(order.total_amount) + '₫';
    document.getElementById('codOrderCode').textContent = `#${order.order_code}`;
    document.getElementById('codSubtotal').textContent = formatPrice(order.subtotal) + '₫';
    document.getElementById('codShipping').textContent = formatPrice(order.shipping_fee) + '₫';
    document.getElementById('codTotal').textContent = formatPrice(order.total_amount) + '₫';
}

// ============================================
// Check Payment Status
// ============================================
async function checkPaymentStatus() {
    try {
        const btn = document.getElementById('checkPaymentBtn');
        btn.disabled = true;
        btn.textContent = 'Đang kiểm tra...';
        
        const response = await fetch(`${API_BASE_URL}/payments/status/${orderId}`);
        const data = await response.json();
        
        if (data.success) {
            if (data.payment.status === 'paid') {
                // Thanh toán thành công
                stopPaymentCheck();
                
                const statusElement = document.getElementById('paymentStatus');
                statusElement.textContent = 'Đã thanh toán';
                statusElement.className = 'payment-status paid';
                
                btn.style.display = 'none';
                
                alert('✅ Thanh toán thành công!\n\nCảm ơn bạn đã mua hàng tại LAG Vintage Shop.');
                
                // Update local order data
                orderData.payment_status = 'paid';
            } else {
                alert('Chưa nhận được thanh toán.\n\nVui lòng kiểm tra lại sau vài phút.');
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
        const btn = document.getElementById('checkPaymentBtn');
        btn.disabled = false;
        btn.textContent = 'Kiểm tra thanh toán';
    }
}

// ============================================
// Auto Check Payment (every 30 seconds)
// ============================================
function startPaymentCheck() {
    checkInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/status/${orderId}`);
            const data = await response.json();
            
            if (data.success && data.payment.status === 'paid') {
                // Tự động cập nhật khi phát hiện thanh toán
                stopPaymentCheck();
                
                const statusElement = document.getElementById('paymentStatus');
                statusElement.textContent = 'Đã thanh toán';
                statusElement.className = 'payment-status paid';
                
                document.getElementById('checkPaymentBtn').style.display = 'none';
                
                alert('✅ Thanh toán thành công!\n\nCảm ơn bạn đã mua hàng tại LAG Vintage Shop.');
                
                orderData.payment_status = 'paid';
            }
        } catch (error) {
            console.error('Auto check error:', error);
        }
    }, 30000); // 30 seconds
}

function stopPaymentCheck() {
    if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
    }
}

// ============================================
// View Order Button
// ============================================
document.getElementById('viewOrderBtn')?.addEventListener('click', () => {
    window.location.href = `order-detail.html?order_id=${orderId}`;
});

// ============================================
// Cleanup on page leave
// ============================================
window.addEventListener('beforeunload', () => {
    stopPaymentCheck();
});

// ============================================
// Utility Functions
// ============================================
function formatPrice(price) {
    return parseFloat(price).toLocaleString('vi-VN');
}
