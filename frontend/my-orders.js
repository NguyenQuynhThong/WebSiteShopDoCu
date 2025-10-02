// ============================================
// MY ORDERS PAGE - LAG VINTAGE SHOP
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';
const SERVER_URL = 'http://localhost:3000';

let userId = localStorage.getItem('userId') || null;
let allOrders = [];
let currentFilter = 'all';

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
    
    setupFilterTabs();
    loadOrders();
});

// ============================================
// Setup Filter Tabs
// ============================================
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active to clicked tab
            tab.classList.add('active');
            
            // Update filter
            currentFilter = tab.dataset.status;
            
            // Filter and display orders
            displayOrders();
        });
    });
}

// ============================================
// Load Orders
// ============================================
async function loadOrders() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/my-orders?userId=${userId}`);
        const data = await response.json();
        
        if (data.success) {
            allOrders = data.orders || [];
            displayOrders();
        } else {
            showEmpty();
        }
    } catch (error) {
        console.error('Load orders error:', error);
        alert('Có lỗi xảy ra khi tải đơn hàng');
    } finally {
        document.getElementById('loadingSection').style.display = 'none';
        document.getElementById('ordersSection').style.display = 'block';
    }
}

// ============================================
// Display Orders
// ============================================
function displayOrders() {
    const container = document.getElementById('ordersList');
    const emptyState = document.getElementById('emptyState');
    
    // Filter orders
    let filteredOrders = allOrders;
    if (currentFilter !== 'all') {
        filteredOrders = allOrders.filter(order => order.order_status === currentFilter);
    }
    
    // Show empty state if no orders
    if (filteredOrders.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    container.style.display = 'flex';
    emptyState.style.display = 'none';
    
    // Display orders
    container.innerHTML = filteredOrders.map(order => createOrderCard(order)).join('');
}

// ============================================
// Create Order Card
// ============================================
function createOrderCard(order) {
    const statusMap = {
        'pending': { text: 'Chờ xác nhận', class: 'pending' },
        'processing': { text: 'Đang xử lý', class: 'processing' },
        'shipping': { text: 'Đang giao hàng', class: 'shipping' },
        'delivered': { text: 'Đã giao hàng', class: 'delivered' },
        'cancelled': { text: 'Đã hủy', class: 'cancelled' }
    };
    
    const status = statusMap[order.order_status] || statusMap['pending'];
    
    // Parse items (assuming items are stored as JSON)
    let itemsPreview = '';
    if (order.items) {
        try {
            const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
            itemsPreview = items.slice(0, 2).map(item => {
                let imageUrl = item.image || '/images/placeholder.svg';
                if (imageUrl.startsWith('/')) {
                    imageUrl = SERVER_URL + imageUrl;
                }
                
                return `
                    <div class="order-item-preview">
                        <img src="${imageUrl}" alt="${item.product_name || item.name}">
                        <div class="order-item-preview-info">
                            <div class="order-item-preview-name">${item.product_name || item.name}</div>
                            <div class="order-item-preview-qty">x${item.quantity}</div>
                        </div>
                    </div>
                `;
            }).join('');
            
            if (items.length > 2) {
                itemsPreview += `<div style="display: flex; align-items: center; color: #999;">+${items.length - 2} sản phẩm</div>`;
            }
        } catch (e) {
            console.error('Error parsing items:', e);
        }
    }
    
    // Action buttons based on order status
    let actionButtons = `
        <button class="btn btn-primary" onclick="viewOrder('${order.order_id}')">
            Xem chi tiết
        </button>
    `;
    
    if (order.order_status === 'pending') {
        actionButtons += `
            <button class="btn btn-danger" onclick="cancelOrder('${order.order_id}')">
                Hủy đơn
            </button>
        `;
    }
    
    if (order.order_status === 'delivered') {
        actionButtons += `
            <button class="btn btn-outline" onclick="reorder('${order.order_id}')">
                Đặt lại
            </button>
        `;
    }
    
    return `
        <div class="order-card">
            <div class="order-card-header">
                <div>
                    <div class="order-code">Đơn hàng #${order.order_code}</div>
                    <div class="order-date">${formatDate(order.created_at)}</div>
                </div>
                <div class="order-status-badge ${status.class}">
                    ${status.text}
                </div>
            </div>
            
            <div class="order-card-body">
                <div class="order-items-preview">
                    ${itemsPreview}
                </div>
            </div>
            
            <div class="order-card-footer">
                <div class="order-total">
                    Tổng tiền:
                    <span class="order-total-amount">${formatPrice(order.total_amount)}₫</span>
                </div>
                <div class="order-actions">
                    ${actionButtons}
                </div>
            </div>
        </div>
    `;
}

// ============================================
// View Order
// ============================================
function viewOrder(orderId) {
    window.location.href = `order-detail.html?order_id=${orderId}`;
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
            loadOrders(); // Reload orders
        } else {
            alert(data.message || 'Không thể hủy đơn hàng');
        }
    } catch (error) {
        console.error('Cancel order error:', error);
        alert('Có lỗi xảy ra khi hủy đơn hàng');
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
        // Get order details
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
// Show Empty State
// ============================================
function showEmpty() {
    document.getElementById('ordersList').style.display = 'none';
    document.getElementById('emptyState').style.display = 'block';
}

// ============================================
// Utility Functions
// ============================================
function formatPrice(price) {
    return parseFloat(price).toLocaleString('vi-VN');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
