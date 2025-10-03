// ============================================
// PRODUCTS PAGE - LAG VINTAGE SHOP
// Quản lý hiển thị và tìm kiếm sản phẩm
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';
const BACKEND_URL = 'http://localhost:3000';
let currentPage = 1;
let currentSearchKeyword = '';
let currentCategory = 'all';
let currentPriceRange = 'all';

// ============================================
// DOM Elements
// ============================================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortFilter = document.getElementById('sortFilter');
const productsGrid = document.getElementById('productsGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const noResultsMessage = document.getElementById('noResultsMessage');
const searchResultsInfo = document.getElementById('searchResultsInfo');
const resultsCount = document.getElementById('resultsCount');
const searchKeyword = document.getElementById('searchKeyword');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const paginationWrapper = document.getElementById('paginationWrapper');

// ============================================
// Initialize Page
// ============================================
// Kiểm tra xem DOM đã ready chưa và components đã load
function initializeProductsPage() {
    // Kiểm tra xem tất cả elements cần thiết đã có chưa
    const requiredElements = [productsGrid, searchInput, searchBtn, categoryFilter];
    const allElementsReady = requiredElements.every(el => el !== null);
    
    if (allElementsReady) {
        loadProducts();
        setupEventListeners();
    } else {
        // Chờ một chút rồi thử lại
        setTimeout(initializeProductsPage, 100);
    }
}

// Kiểm tra trạng thái DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeProductsPage);
} else {
    initializeProductsPage();
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Search button click
    searchBtn.addEventListener('click', handleSearch);
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Clear search
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentSearchKeyword = '';
        searchResultsInfo.style.display = 'none';
        currentPage = 1;
        loadProducts();
    });
    
    // Category filter
    categoryFilter.addEventListener('change', (e) => {
        currentCategory = e.target.value;
        currentPage = 1;
        if (currentSearchKeyword) {
            searchProducts();
        } else {
            loadProducts();
        }
    });
    
    // Price filter
    priceFilter.addEventListener('change', (e) => {
        currentPriceRange = e.target.value;
        currentPage = 1;
        if (currentSearchKeyword) {
            searchProducts();
        } else {
            loadProducts();
        }
    });
    
    // Sort filter (client-side sorting for now)
    sortFilter.addEventListener('change', () => {
        currentPage = 1;
        if (currentSearchKeyword) {
            searchProducts();
        } else {
            loadProducts();
        }
    });
}

// ============================================
// Handle Search
// ============================================
function handleSearch() {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        alert('Vui lòng nhập từ khóa tìm kiếm!');
        return;
    }
    
    currentSearchKeyword = keyword;
    currentPage = 1;
    searchProducts();
}

// ============================================
// Load Products (All or Filtered)
// ============================================
async function loadProducts() {
    try {
        showLoading();
        
        const url = new URL(`${API_BASE_URL}/products`);
        url.searchParams.append('page', currentPage);
        url.searchParams.append('limit', 20);
        
        if (currentCategory && currentCategory !== 'all') {
            url.searchParams.append('category', currentCategory);
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            displayProducts(result.data);
            displayPagination(result.pagination);
        } else {
            showError('Không thể tải sản phẩm');
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Có lỗi xảy ra khi tải sản phẩm');
    } finally {
        hideLoading();
    }
}

// ============================================
// Search Products
// ============================================
async function searchProducts() {
    try {
        showLoading();
        
        const url = new URL(`${API_BASE_URL}/products/search`);
        url.searchParams.append('q', currentSearchKeyword);
        url.searchParams.append('page', currentPage);
        url.searchParams.append('limit', 20);
        
        if (currentCategory && currentCategory !== 'all') {
            url.searchParams.append('category', currentCategory);
        }
        
        if (currentPriceRange && currentPriceRange !== 'all') {
            url.searchParams.append('priceRange', currentPriceRange);
        }
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            displayProducts(result.data);
            displayPagination(result.pagination);
            showSearchInfo(result.pagination.total, currentSearchKeyword);
        } else {
            showError(result.message || 'Không thể tìm kiếm sản phẩm');
        }
        
    } catch (error) {
        console.error('Error searching products:', error);
        showError('Có lỗi xảy ra khi tìm kiếm');
    } finally {
        hideLoading();
    }
}

// ============================================
// Display Products
// ============================================
function displayProducts(products) {
    productsGrid.innerHTML = '';
    
    if (!products || products.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    // Apply client-side sorting
    const sortedProducts = sortProducts(products);
    
    sortedProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// ============================================
// Sort Products (Client-side)
// ============================================
function sortProducts(products) {
    const sortValue = sortFilter.value;
    const sorted = [...products];
    
    switch (sortValue) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'newest':
            return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        case 'popular':
            // For now, return as-is (can implement based on sales/views later)
            return sorted;
        default:
            return sorted;
    }
}

// ============================================
// Create Product Card HTML
// ============================================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const hasDiscount = product.old_price && product.old_price > product.price;
    const discountPercent = hasDiscount 
        ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
        : 0;
    
    // Fix image URL - add backend URL if it's a relative path
    let imageUrl = product.image;
    if (!imageUrl) {
        // Fallback if no image provided
        imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZjlmYWZiIi8+CjxwYXRoIGQ9Ik0xNTAgMTUwaDEwMHYxMDBoLTEwMHoiIGZpbGw9IiNlNWU3ZWIiLz4KPHRleHQgeD0iMjAwIiB5PSIyNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2YjcyODAiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiI+S2jDtG5nIGPDsyDhuqNuaDwvdGV4dD4KPC9zdmc+';
    } else if (imageUrl.startsWith('/images/')) {
        imageUrl = BACKEND_URL + imageUrl;
    }
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2U1ZTdlYiIgc3Ryb2tlLXdpZHRoPSIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y5ZmFmYiIvPgo8cGF0aCBkPSJNMjAwIDIwMGgyMDB2MjAwaC0yMDB6IiBmaWxsPSIjOWNhM2FmIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3MjgwIiBmb250LXNpemU9IjE0IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4='">
            ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
            ${hasDiscount && !product.badge ? `<span class="badge">-${discountPercent}%</span>` : ''}
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-desc">${product.description || 'Tình trạng: ' + (product.condition_percentage || 90) + '%' + (product.size ? ' - Size ' + product.size : '')}</p>
            <div class="product-price">
                <span class="price-current">${formatPrice(product.price)}</span>
                ${hasDiscount ? `<span class="price-old">${formatPrice(product.old_price)}</span>` : ''}
            </div>
            <button class="btn-add-cart" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        </div>
    `;
    
    // Add click event to view product detail
    card.querySelector('.product-image').style.cursor = 'pointer';
    card.querySelector('.product-image').addEventListener('click', () => {
        window.location.href = `product-detail.html?id=${product.id}`;
    });
    
    card.querySelector('h3').style.cursor = 'pointer';
    card.querySelector('h3').addEventListener('click', () => {
        window.location.href = `product-detail.html?id=${product.id}`;
    });
    
    return card;
}

// ============================================
// Display Pagination
// ============================================
function displayPagination(pagination) {
    paginationWrapper.innerHTML = '';
    
    if (!pagination || pagination.totalPages <= 1) {
        return;
    }
    
    const { page, totalPages } = pagination;
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn-page';
    prevBtn.textContent = '← Trước';
    prevBtn.disabled = page === 1;
    prevBtn.addEventListener('click', () => {
        if (page > 1) {
            currentPage = page - 1;
            if (currentSearchKeyword) {
                searchProducts();
            } else {
                loadProducts();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginationWrapper.appendChild(prevBtn);
    
    // Page numbers
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = 'btn-page' + (i === page ? ' active' : '');
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            if (currentSearchKeyword) {
                searchProducts();
            } else {
                loadProducts();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationWrapper.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn-page';
    nextBtn.textContent = 'Tiếp →';
    nextBtn.disabled = page === totalPages;
    nextBtn.addEventListener('click', () => {
        if (page < totalPages) {
            currentPage = page + 1;
            if (currentSearchKeyword) {
                searchProducts();
            } else {
                loadProducts();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    paginationWrapper.appendChild(nextBtn);
}

// ============================================
// Show Search Info
// ============================================
function showSearchInfo(total, keyword) {
    searchResultsInfo.style.display = 'flex';
    resultsCount.textContent = total;
    searchKeyword.textContent = keyword;
}

// ============================================
// Utility Functions
// ============================================
function showLoading() {
    loadingIndicator.style.display = 'flex';
    productsGrid.style.display = 'none';
    noResultsMessage.style.display = 'none';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
    productsGrid.style.display = 'grid';
}

function showNoResults() {
    noResultsMessage.style.display = 'flex';
    productsGrid.style.display = 'none';
}

function hideNoResults() {
    noResultsMessage.style.display = 'none';
    productsGrid.style.display = 'grid';
}

function showError(message) {
    alert(message);
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// ============================================
// Add to Cart Function
// ============================================
async function addToCart(productId) {
    try {
        // Kiểm tra đăng nhập
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
            // Chưa đăng nhập, hiển thị thông báo và chuyển đến trang login
            if (confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.\nChuyển đến trang đăng nhập?')) {
                window.location.href = 'login.html';
            }
            return;
        }
        
        // Call API - chỉ gửi userId
        const response = await fetch(`${API_BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: productId,
                quantity: 1,
                userId: userId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('✓ Đã thêm vào giỏ hàng!', 'success');
            updateCartCount();
        } else {
            // Nếu API yêu cầu login
            if (data.requireLogin) {
                if (confirm(data.message + '\nChuyển đến trang đăng nhập?')) {
                    window.location.href = 'login.html';
                }
            } else {
                showNotification(data.message || 'Không thể thêm vào giỏ hàng', 'error');
            }
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        showNotification('Có lỗi xảy ra', 'error');
    }
}

// ============================================
// Show Notification
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Update Cart Count
// ============================================
async function updateCartCount() {
    try {
        const userId = localStorage.getItem('userId');
        const sessionId = localStorage.getItem('sessionId');
        
        if (!userId && !sessionId) return;
        
        const response = await fetch(`${API_BASE_URL}/cart?userId=${userId || ''}&sessionId=${sessionId || ''}`);
        const data = await response.json();
        
        if (data.success && data.summary) {
            const cartBadge = document.querySelector('.cart-count');
            if (cartBadge) {
                cartBadge.textContent = data.summary.totalItems;
            }
        }
    } catch (error) {
        console.error('Update cart count error:', error);
    }
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});
