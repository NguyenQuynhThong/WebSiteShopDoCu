/**
 * Product Detail Page JavaScript
 */

const API_BASE_URL = 'http://localhost:3000/api';
const BACKEND_URL = 'http://localhost:3000';
let currentProduct = null;

// Get product ID from URL
function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Load product detail from API
async function loadProductDetail() {
    const productId = getProductIdFromURL();
    
    if (!productId) {
        showError('Không tìm thấy sản phẩm');
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            currentProduct = result.data;
            displayProductDetail(currentProduct);
        } else {
            showError(result.message || 'Không thể tải sản phẩm');
        }
    } catch (error) {
        console.error('Error loading product:', error);
        showError('Lỗi khi tải sản phẩm');
    } finally {
        hideLoading();
    }
}

// Display product detail
function displayProductDetail(product) {
    // Fix image URL
    let imageUrl = product.image;
    if (imageUrl && imageUrl.startsWith('/images/')) {
        imageUrl = BACKEND_URL + imageUrl;
    }
    
    // Update page title
    document.title = `${product.name} - SecondShop`;
    
    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb-list .active');
    if (breadcrumb) {
        breadcrumb.textContent = product.name;
    }
    
    // Update main image
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.src = imageUrl;
        mainImage.alt = product.name;
    }
    
    // Update thumbnails (use same image for now)
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.src = imageUrl;
        thumb.alt = product.name;
    });
    
    // Update product title
    const titleElement = document.querySelector('.product-title');
    if (titleElement) {
        titleElement.textContent = product.name;
    }
    
    // Update price
    const priceElement = document.querySelector('.price-current');
    if (priceElement) {
        priceElement.textContent = formatPrice(product.price);
    }
    
    // Update old price if exists
    if (product.old_price) {
        const oldPriceElement = document.querySelector('.price-old');
        if (oldPriceElement) {
            oldPriceElement.textContent = formatPrice(product.old_price);
        }
    }
    
    // Update description
    const descriptionElement = document.querySelector('.product-description-content');
    if (descriptionElement) {
        descriptionElement.innerHTML = `
            <p>${product.description || 'Không có mô tả chi tiết.'}</p>
            <ul>
                <li><strong>Tình trạng:</strong> ${product.condition_percentage || 'Tốt'}</li>
                <li><strong>Số lượng còn:</strong> ${product.stock || 0} sản phẩm</li>
                ${product.size ? `<li><strong>Size:</strong> ${product.size}</li>` : ''}
                <li><strong>Danh mục:</strong> ${product.category || 'Chưa phân loại'}</li>
            </ul>
        `;
    }
    
    // Update quantity max
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && product.stock) {
        quantityInput.max = product.stock;
    }
    
    // Update stock status
    updateStockStatus(product.stock);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Update stock status
function updateStockStatus(stock) {
    const stockElement = document.querySelector('.stock-status');
    if (stockElement) {
        if (stock > 10) {
            stockElement.innerHTML = '<span style="color: #10b981;">✓ Còn hàng</span>';
        } else if (stock > 0) {
            stockElement.innerHTML = `<span style="color: #f59e0b;">⚠ Chỉ còn ${stock} sản phẩm</span>`;
        } else {
            stockElement.innerHTML = '<span style="color: #ef4444;">✗ Hết hàng</span>';
        }
    }
}

// Show loading
function showLoading() {
    const loadingHtml = `
        <div class="loading-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center;">
            <div class="spinner"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHtml);
}

// Hide loading
function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Show error
function showError(message) {
    const errorHtml = `
        <div class="error-message" style="padding: 20px; background: #fee2e2; color: #dc2626; border-radius: 8px; margin: 20px; text-align: center;">
            <h3>⚠️ Lỗi</h3>
            <p>${message}</p>
            <a href="products.html" class="btn-primary" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">Quay lại danh sách sản phẩm</a>
        </div>
    `;
    const container = document.querySelector('.product-detail-layout');
    if (container) {
        container.innerHTML = errorHtml;
    }
}

// Change main product image
function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainProductImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Update main image
    mainImage.src = thumbnail.src.replace('w=150', 'w=600');
    
    // Update active thumbnail
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
}

// Quantity controls
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const max = parseInt(quantityInput.max);
    let currentValue = parseInt(quantityInput.value);
    
    if (currentValue < max) {
        quantityInput.value = currentValue + 1;
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    const min = parseInt(quantityInput.min);
    let currentValue = parseInt(quantityInput.value);
    
    if (currentValue > min) {
        quantityInput.value = currentValue - 1;
    }
}

// Size selection
document.addEventListener('DOMContentLoaded', () => {
    // Load product detail when page loads
    loadProductDetail();
    
    const sizeButtons = document.querySelectorAll('.size-btn:not([disabled])');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Color selection
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            colorButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Add to cart button
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = document.getElementById('quantity').value;
            const size = document.querySelector('.size-btn.active')?.textContent || 'M';
            const color = document.querySelector('.color-btn.active')?.title || 'Đen';
            
            // Get current cart count
            let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
            cartCount += parseInt(quantity);
            localStorage.setItem('cartCount', cartCount);
            
            // Update cart count display
            if (window.ComponentLoader) {
                window.ComponentLoader.updateCartCount();
            }
            
            // Show success message
            alert(`Đã thêm ${quantity} sản phẩm (Size: ${size}, Màu: ${color}) vào giỏ hàng!`);
        });
    }

    // Buy now button
    const buyNowBtn = document.querySelector('.btn-buy-now');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            const quantity = document.getElementById('quantity').value;
            const size = document.querySelector('.size-btn.active')?.textContent || 'M';
            const color = document.querySelector('.color-btn.active')?.title || 'Đen';
            
            // Get current cart count
            let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
            cartCount += parseInt(quantity);
            localStorage.setItem('cartCount', cartCount);
            
            // Redirect to cart
            window.location.href = 'cart.html';
        });
    }

    // Wishlist button
    const wishlistBtn = document.querySelector('.btn-wishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('span');
            icon.textContent = this.classList.contains('active') ? '♥' : '♡';
            
            const message = this.classList.contains('active') 
                ? 'Đã thêm vào danh sách yêu thích!' 
                : 'Đã xóa khỏi danh sách yêu thích!';
            alert(message);
        });
    }

    // Related products - Add to cart
    const relatedAddToCartBtns = document.querySelectorAll('.related-products .btn-add-cart');
    relatedAddToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
            cartCount += 1;
            localStorage.setItem('cartCount', cartCount);
            
            if (window.ComponentLoader) {
                window.ComponentLoader.updateCartCount();
            }
            
            alert('Đã thêm sản phẩm vào giỏ hàng!');
        });
    });
});

// Tab switching
function switchTab(tabName) {
    // Hide all tab panels
    const panels = document.querySelectorAll('.tab-panel');
    panels.forEach(panel => panel.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab panel
    const selectedPanel = document.getElementById(tabName);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

// Image zoom effect
document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('mainProductImage');
    if (mainImage) {
        mainImage.addEventListener('click', () => {
            // Could implement a modal with larger image here
            console.log('Image clicked - implement zoom modal');
        });
    }
});

// Load more reviews
const loadMoreBtn = document.querySelector('.btn-load-more');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        alert('Tính năng đang phát triển - Sẽ load thêm đánh giá');
    });
}

// Share buttons
document.addEventListener('DOMContentLoaded', () => {
    const shareBtns = document.querySelectorAll('.share-btn');
    shareBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.classList.contains('facebook') ? 'Facebook' : 
                           btn.classList.contains('twitter') ? 'Twitter' : 'Pinterest';
            alert(`Chia sẻ lên ${platform} - Tính năng đang phát triển`);
        });
    });
});
