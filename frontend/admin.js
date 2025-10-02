// ============================================
// ADMIN DASHBOARD - LAG VINTAGE SHOP
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';

// ============================================
// Check Admin Authentication
// ============================================
function checkAdminAuth() {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
        alert('Vui lòng đăng nhập để truy cập trang admin');
        window.location.href = 'login.html';
        return null;
    }
    
    const user = JSON.parse(userStr);
    
    if (user.role !== 'admin') {
        alert('Bạn không có quyền truy cập trang này');
        window.location.href = 'index.html';
        return null;
    }
    
    return user;
}

// ============================================
// Load Dashboard Statistics
// ============================================
async function loadDashboardStats() {
    try {
        // Load products count
        const productsRes = await fetch(`${API_BASE_URL}/products`);
        const productsData = await productsRes.json();
        
        // Load orders
        const ordersRes = await fetch(`${API_BASE_URL}/orders`);
        const ordersData = await ordersRes.json();
        
        console.log('Products data:', productsData); // Debug
        console.log('Orders data:', ordersData); // Debug
        
        // Calculate statistics - API trả về data.data cho products
        const totalProducts = productsData.success && productsData.data ? productsData.data.length : 0;
        const totalOrders = ordersData.success && ordersData.orders ? ordersData.orders.length : 0;
        
        // Calculate today's orders and revenue
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = ordersData.orders ? ordersData.orders.filter(order => {
            const orderDate = new Date(order.created_at).toISOString().split('T')[0];
            return orderDate === today;
        }) : [];
        
        const todayRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
        
        // Update UI
        updateDashboardUI(todayRevenue, todayOrders.length, totalProducts, totalOrders);
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

function updateDashboardUI(revenue, newOrders, totalProducts, totalOrders) {
    // Update revenue
    const revenueElement = document.querySelector('.stat-card:nth-child(1) .stat-value');
    if (revenueElement) {
        revenueElement.textContent = formatCurrency(revenue);
    }
    
    // Update new orders
    const ordersElement = document.querySelector('.stat-card:nth-child(2) .stat-value');
    if (ordersElement) {
        ordersElement.textContent = newOrders;
    }
    
    // Update total products
    const productsElement = document.querySelector('.stat-card:nth-child(3) .stat-value');
    if (productsElement) {
        productsElement.textContent = totalProducts;
    }
    
    // Update total customers (using orders as proxy)
    const customersElement = document.querySelector('.stat-card:nth-child(4) .stat-value');
    if (customersElement) {
        customersElement.textContent = totalOrders;
    }
}

// ============================================
// Load Products Table
// ============================================
async function loadProductsTable() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        
        console.log('Products API response:', data); // Debug log
        
        // API trả về data.data, không phải data.products
        const products = data.success ? data.data : [];
        
        if (products && products.length > 0) {
            const tbody = document.querySelector('#products tbody');
            if (!tbody) {
                console.error('Products tbody not found');
                return;
            }
            
            tbody.innerHTML = '';
            
            products.forEach(product => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${String(product.id).padStart(3, '0')}</td>
                    <td>
                        <img src="${API_BASE_URL.replace('/api', '')}/images/${product.image.replace('/images/', '')}" 
                             alt="${product.name}" 
                             class="table-img"
                             onerror="this.src='${API_BASE_URL.replace('/api', '')}/images/placeholder.svg'">
                    </td>
                    <td>${product.name}</td>
                    <td>${product.category || 'N/A'}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td>${product.stock}</td>
                    <td>
                        <span class="badge-status ${product.stock > 0 ? 'active' : 'inactive'}">
                            ${product.stock > 0 ? 'Đang bán' : 'Hết hàng'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-action edit" onclick="editProduct(${product.id})">Sửa</button>
                        <button class="btn-action delete" onclick="deleteProduct(${product.id})">Xóa</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            
            console.log(`✅ Loaded ${products.length} products`);
        } else {
            console.warn('No products found or API error');
            const tbody = document.querySelector('#products tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Không có sản phẩm nào</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error loading products:', error);
        const tbody = document.querySelector('#products tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px; color: red;">Lỗi khi tải dữ liệu</td></tr>';
        }
    }
}

// ============================================
// Load Orders Table
// ============================================
async function loadOrdersTable() {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`);
        const data = await response.json();
        
        if (data.success && data.orders) {
            const tbody = document.querySelector('#orders tbody');
            if (!tbody) return;
            
            tbody.innerHTML = '';
            
            // Sort by date descending and take first 10
            const recentOrders = data.orders
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 10);
            
            recentOrders.forEach(order => {
                const orderCode = `#ORD${String(order.order_id).padStart(3, '0')}`;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${orderCode}</td>
                    <td>${order.full_name || 'N/A'}</td>
                    <td>${formatDate(order.created_at)}</td>
                    <td>${formatCurrency(order.total_amount)}</td>
                    <td><span class="badge-status ${getOrderStatusClass(order.status)}">${getOrderStatusText(order.status)}</span></td>
                    <td>
                        <button class="btn-action edit" onclick="viewOrder(${order.order_id})">Xem</button>
                        <button class="btn-action" onclick="openOrderStatusModal(${order.order_id}, '${orderCode}')">Cập nhật</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            
            console.log(`✅ Loaded ${recentOrders.length} orders`);
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// ============================================
// Load Customers Table
// ============================================
async function loadCustomersTable() {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        const data = await response.json();
        
        console.log('Customers API response:', data); // Debug
        
        if (data.success && data.customers) {
            const tbody = document.querySelector('#customers-tbody');
            if (!tbody) {
                console.error('Customers tbody not found');
                return;
            }
            
            tbody.innerHTML = '';
            
            if (data.customers.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem;">Chưa có khách hàng nào</td></tr>';
                return;
            }
            
            data.customers.forEach(customer => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${String(customer.user_id).padStart(3, '0')}</td>
                    <td>${customer.full_name || 'N/A'}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone || 'N/A'}</td>
                    <td>${customer.total_orders}</td>
                    <td>${formatCurrency(customer.total_spent)}</td>
                    <td>${formatDate(customer.created_at)}</td>
                    <td>
                        <span class="badge-status ${customer.status === 'active' ? 'active' : 'inactive'}">
                            ${customer.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                        </span>
                    </td>
                    <td>
                        <button class="btn-action view" onclick="viewCustomerDetail(${customer.user_id})">Xem</button>
                        <button class="btn-action ${customer.status === 'active' ? 'delete' : 'edit'}" 
                                onclick="toggleCustomerStatus(${customer.user_id}, '${customer.status}')">
                            ${customer.status === 'active' ? 'Khóa' : 'Mở khóa'}
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            
            console.log(`✅ Loaded ${data.customers.length} customers`);
        } else {
            console.warn('No customers found or API error');
            const tbody = document.querySelector('#customers-tbody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: red;">Lỗi khi tải dữ liệu</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error loading customers:', error);
        const tbody = document.querySelector('#customers-tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: red;">Lỗi khi tải dữ liệu</td></tr>';
        }
    }
}

// ============================================
// Load Statistics
// ============================================
async function loadStatistics() {
    try {
        console.log('📊 Loading statistics...');
        
        // Load orders data
        const ordersRes = await fetch(`${API_BASE_URL}/orders`);
        const ordersData = await ordersRes.json();
        
        if (!ordersData.success || !ordersData.orders) {
            console.error('Failed to load orders for statistics');
            return;
        }
        
        const orders = ordersData.orders;
        
        // Calculate statistics for different periods
        const now = new Date();
        const stats = {
            today: { revenue: 0, orders: 0 },
            week: { revenue: 0, orders: 0 },
            month: { revenue: 0, orders: 0 },
            quarter: { revenue: 0, orders: 0 },
            year: { revenue: 0, orders: 0 }
        };
        
        orders.forEach(order => {
            const orderDate = new Date(order.created_at);
            const amount = parseFloat(order.total_amount) || 0;
            
            // Today
            if (isSameDay(orderDate, now)) {
                stats.today.revenue += amount;
                stats.today.orders++;
            }
            
            // Last 7 days
            if (daysDiff(orderDate, now) <= 7) {
                stats.week.revenue += amount;
                stats.week.orders++;
            }
            
            // Last 30 days
            if (daysDiff(orderDate, now) <= 30) {
                stats.month.revenue += amount;
                stats.month.orders++;
            }
            
            // Last 90 days
            if (daysDiff(orderDate, now) <= 90) {
                stats.quarter.revenue += amount;
                stats.quarter.orders++;
            }
            
            // This year
            if (orderDate.getFullYear() === now.getFullYear()) {
                stats.year.revenue += amount;
                stats.year.orders++;
            }
        });
        
        // Update UI
        updateStatisticsUI(stats);
        
        console.log('✅ Statistics loaded:', stats);
        
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

function updateStatisticsUI(stats) {
    // Update summary cards
    const summaryCards = document.querySelectorAll('#statistics .summary-card');
    
    if (summaryCards[0]) {
        const revenueValue = summaryCards[0].querySelector('.summary-value');
        if (revenueValue) {
            revenueValue.textContent = formatCurrency(stats.month.revenue);
        }
    }
    
    if (summaryCards[1]) {
        const ordersValue = summaryCards[1].querySelector('.summary-value');
        if (ordersValue) {
            const avgPerDay = Math.round(stats.month.orders / 30);
            ordersValue.textContent = `${avgPerDay} đơn`;
        }
    }
    
    if (summaryCards[2]) {
        const avgOrderValue = summaryCards[2].querySelector('.summary-value');
        if (avgOrderValue) {
            const avg = stats.month.orders > 0 ? stats.month.revenue / stats.month.orders : 0;
            avgOrderValue.textContent = formatCurrency(avg);
        }
    }
}

// Helper functions for date calculations
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function daysDiff(date1, date2) {
    const diff = date2 - date1;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// ============================================
// Setup Statistics Filters
// ============================================
function setupStatisticsFilters() {
    const filterBtns = document.querySelectorAll('#statistics .filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get period from button text
            const period = this.textContent.trim();
            console.log('Filter changed to:', period);
            
            // Reload statistics with new filter
            loadStatistics();
        });
    });
}

// ============================================
// Customer Actions
// ============================================
async function viewCustomerDetail(customerId) {
    try {
        // Fetch customer details
        const response = await fetch(`${API_BASE_URL}/users/${customerId}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch customer details');
        }
        
        const data = await response.json();
        const customer = data.data;
        
        // Populate customer info
        document.getElementById('detailCustomerId').textContent = `#CUS${String(customer.user_id).padStart(3, '0')}`;
        document.getElementById('detailCustomerName').textContent = customer.full_name || 'N/A';
        document.getElementById('detailCustomerEmail').textContent = customer.email || 'N/A';
        document.getElementById('detailCustomerPhone').textContent = customer.phone || 'N/A';
        document.getElementById('detailCustomerJoined').textContent = formatDate(customer.created_at);
        
        // Calculate statistics from orders
        const totalOrders = customer.total_orders || 0;
        const totalSpent = customer.total_spent || 0;
        
        document.getElementById('detailCustomerOrders').textContent = totalOrders;
        document.getElementById('detailCustomerSpent').textContent = formatCurrency(totalSpent);
        
        // Show modal
        document.getElementById('customerModal').style.display = 'flex';
    } catch (error) {
        console.error('Error loading customer details:', error);
        alert('Có lỗi khi tải thông tin khách hàng');
    }
}

function closeCustomerModal() {
    document.getElementById('customerModal').style.display = 'none';
}

async function toggleCustomerStatus(customerId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'inactive' ? 'khóa' : 'mở khóa';
    
    if (!confirm(`Bạn có chắc chắn muốn ${action} khách hàng này?`)) {
        return;
    }
    
    try {
        // TODO: Implement API endpoint for updating user status
        alert(`Chức năng ${action} tài khoản đang được phát triển`);
        // After implementing:
        // const response = await fetch(`${API_BASE_URL}/users/${customerId}/status`, {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ status: newStatus })
        // });
        // if (response.ok) {
        //     loadCustomersTable(); // Reload
        // }
    } catch (error) {
        console.error('Error toggling customer status:', error);
        alert('Có lỗi xảy ra');
    }
}

// ============================================
// Helper Functions
// ============================================
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getOrderStatusClass(status) {
    const statusMap = {
        'pending': 'warning',
        'confirmed': 'info',
        'shipping': 'primary',
        'delivered': 'active',
        'cancelled': 'inactive'
    };
    return statusMap[status] || 'warning';
}

function getOrderStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xác nhận',
        'confirmed': 'Đã xác nhận',
        'shipping': 'Đang giao',
        'delivered': 'Đã giao',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || 'Chờ xử lý';
}

// ============================================
// Product Actions
// ============================================
function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Thêm Sản Phẩm Mới';
    document.getElementById('submitBtnText').textContent = 'Thêm Sản Phẩm';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    
    const modal = document.getElementById('productModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function editProduct(productId) {
    // Fetch product details
    fetch(`${API_BASE_URL}/products/${productId}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.product) {
                const product = data.product;
                
                // Fill form with product data
                document.getElementById('modalTitle').textContent = 'Sửa Sản Phẩm';
                document.getElementById('submitBtnText').textContent = 'Cập Nhật';
                document.getElementById('productId').value = product.id;
                document.getElementById('productName').value = product.name;
                document.getElementById('productCategory').value = product.category;
                document.getElementById('productPrice').value = product.price;
                document.getElementById('productStock').value = product.stock;
                document.getElementById('productSize').value = product.size || '';
                document.getElementById('productCondition').value = product.condition_percentage || 'good';
                document.getElementById('productImage').value = product.image ? product.image.replace('/images/', '') : '';
                document.getElementById('productDescription').value = product.description || '';
                
                // Show modal
                const modal = document.getElementById('productModal');
                modal.style.display = 'flex';
                modal.classList.add('show');
            } else {
                alert('Không thể tải thông tin sản phẩm');
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            alert('Có lỗi xảy ra khi tải thông tin sản phẩm');
        });
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.getElementById('productForm').reset();
}

// Handle Product Form Submit
document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('productForm');
    if (productForm) {
        productForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const productId = document.getElementById('productId').value;
            const isEdit = productId !== '';
            
            const productData = {
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: parseFloat(document.getElementById('productPrice').value),
                stock: parseInt(document.getElementById('productStock').value),
                size: document.getElementById('productSize').value || null,
                condition: document.getElementById('productCondition').value,
                image: document.getElementById('productImage').value || 'placeholder.svg',
                description: document.getElementById('productDescription').value || null
            };
            
            try {
                const url = isEdit 
                    ? `${API_BASE_URL}/products/${productId}`
                    : `${API_BASE_URL}/products`;
                    
                const method = isEdit ? 'PUT' : 'POST';
                
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(productData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert(isEdit ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
                    closeProductModal();
                    loadProductsTable(); // Reload table
                } else {
                    alert(data.message || 'Có lỗi xảy ra');
                }
            } catch (error) {
                console.error('Error saving product:', error);
                alert('Có lỗi xảy ra khi lưu sản phẩm');
            }
        });
    }
});

async function deleteProduct(productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Xóa sản phẩm thành công!');
            loadProductsTable(); // Reload table
        } else {
            alert(data.message || 'Không thể xóa sản phẩm');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Có lỗi xảy ra khi xóa sản phẩm');
    }
}

// ============================================
// Order Actions
// ============================================
function viewOrder(orderId) {
    window.location.href = `order-detail.html?id=${orderId}`;
}

function openOrderStatusModal(orderId, orderCode) {
    document.getElementById('orderIdToUpdate').value = orderId;
    document.getElementById('orderCodeDisplay').textContent = orderCode;
    
    const modal = document.getElementById('orderStatusModal');
    modal.style.display = 'flex';
    modal.classList.add('show');
}

function closeOrderStatusModal() {
    const modal = document.getElementById('orderStatusModal');
    modal.style.display = 'none';
    modal.classList.remove('show');
    document.getElementById('orderStatusForm').reset();
}

// Handle Order Status Form Submit
document.addEventListener('DOMContentLoaded', function() {
    const orderStatusForm = document.getElementById('orderStatusForm');
    if (orderStatusForm) {
        orderStatusForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const orderId = document.getElementById('orderIdToUpdate').value;
            const newStatus = document.getElementById('orderStatus').value;
            
            if (!newStatus) {
                alert('Vui lòng chọn trạng thái');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    alert('Cập nhật trạng thái thành công!');
                    closeOrderStatusModal();
                    loadOrdersTable(); // Reload table
                } else {
                    alert(data.message || 'Không thể cập nhật trạng thái');
                }
            } catch (error) {
                console.error('Error updating order status:', error);
                alert('Có lỗi xảy ra khi cập nhật trạng thái');
            }
        });
    }
});

// ============================================
// Sidebar Navigation
// ============================================
function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get target section
            const target = link.getAttribute('href').substring(1);
            
            console.log('Navigating to section:', target); // Debug
            
            // Hide all sections
            document.querySelectorAll('.admin-section, .dashboard-stats').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section
            if (target === 'dashboard') {
                const dashboardStats = document.querySelector('.dashboard-stats');
                if (dashboardStats) {
                    dashboardStats.style.display = 'grid';
                    loadDashboardStats(); // Reload stats
                }
            } else if (target === 'products') {
                const targetSection = document.querySelector(`#${target}`);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    loadProductsTable(); // Reload products when viewing
                } else {
                    console.error('Products section not found');
                }
            } else if (target === 'orders') {
                const targetSection = document.querySelector(`#${target}`);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    loadOrdersTable(); // Reload orders when viewing
                } else {
                    console.error('Orders section not found');
                }
            } else if (target === 'customers') {
                const targetSection = document.querySelector(`#${target}`);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    loadCustomersTable(); // Load customers when viewing
                } else {
                    console.error('Customers section not found');
                }
            } else if (target === 'statistics') {
                const targetSection = document.querySelector(`#${target}`);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    loadStatistics(); // Load statistics when viewing
                } else {
                    console.error('Statistics section not found');
                }
            } else if (target === 'settings') {
                alert('Chức năng cài đặt đang được phát triển');
            } else {
                const targetSection = document.querySelector(`#${target}`);
                if (targetSection) {
                    targetSection.style.display = 'block';
                } else {
                    console.warn(`Section #${target} not found`);
                }
            }
        });
    });
}

// ============================================
// Logout
// ============================================
function setupLogout() {
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            localStorage.removeItem('userId');
            window.location.href = 'login.html';
        });
    }
}

// ============================================
// Display Admin Info
// ============================================
function displayAdminInfo(user) {
    const adminUserSpan = document.querySelector('.admin-user span');
    if (adminUserSpan) {
        adminUserSpan.textContent = user.fullName || user.email;
    }
    
    const userAvatar = document.querySelector('.user-avatar');
    if (userAvatar && user.fullName) {
        userAvatar.textContent = user.fullName.charAt(0).toUpperCase();
    }
}

// ============================================
// Initialize Dashboard
// ============================================
window.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Admin Dashboard...');
    
    // Check authentication
    const user = checkAdminAuth();
    if (!user) return;
    
    // Display admin info
    displayAdminInfo(user);
    
    // Setup navigation and logout
    setupSidebarNavigation();
    setupLogout();
    
    // Initially hide all sections except dashboard
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show dashboard by default
    const dashboardStats = document.querySelector('.dashboard-stats');
    if (dashboardStats) {
        dashboardStats.style.display = 'grid';
    }
    
    // Load initial data
    console.log('📊 Loading dashboard stats...');
    loadDashboardStats();
    
    console.log('📦 Loading products table...');
    loadProductsTable();
    
    console.log('🛒 Loading orders table...');
    loadOrdersTable();
    
    console.log('👥 Loading customers table...');
    loadCustomersTable();
    
    console.log('✅ Admin Dashboard initialized successfully');
    
    // Setup statistics filter buttons
    setupStatisticsFilters();
});
