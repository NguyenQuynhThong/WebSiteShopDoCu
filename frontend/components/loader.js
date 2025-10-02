/**
 * Component Loader
 * Load reusable HTML components into pages
 */

// Load component into element
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load all common components
async function loadCommonComponents() {
    await Promise.all([
        loadComponent('header-placeholder', 'components/header.html'),
        loadComponent('nav-placeholder', 'components/navigation.html'),
        loadComponent('footer-placeholder', 'components/footer.html'),
        loadComponent('chatbot-placeholder', 'components/chatbot.html')
    ]);
    
    // Set active navigation after loading
    setActiveNavigation();
    
    // Initialize cart count
    updateCartCount();
    
    // Initialize chatbot
    initializeChatbot();
    
    // Initialize header navigation
    initializeHeaderNavigation();
}

// Set active navigation based on current page
function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove all active classes
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page
    if (currentPage === 'index.html' || currentPage === '') {
        document.getElementById('nav-home')?.classList.add('active');
    } else if (currentPage === 'products.html') {
        document.getElementById('nav-products')?.classList.add('active');
    } else if (currentPage === 'contact.html') {
        document.getElementById('nav-contact')?.classList.add('active');
    }
}

// Update cart count from localStorage
function updateCartCount() {
    const cartCount = localStorage.getItem('cartCount') || '0';
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = cartCount;
    });
}

// Initialize chatbot functionality  
function initializeChatbot() {
    // Chatbot được khởi tạo bởi chatbot.js
    // Chỉ cần đợi component load xong
    console.log('Chatbot component loaded');
}

// Initialize search functionality
function initializeSearch() {
    const searchButton = document.querySelector('.btn-search');
    const searchInput = document.querySelector('.search-bar input');

    if (searchButton && searchInput) {
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                // Redirect to products page with search query
                window.location.href = `products.html?search=${encodeURIComponent(query)}`;
            }
        };

        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

// Initialize header navigation links
function initializeHeaderNavigation() {
    // Update user info if logged in
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const headerNav = document.querySelector('.header-nav');
    
    if (user && headerNav) {
        // User is logged in, replace login/register with user menu
        headerNav.innerHTML = `
            <span class="nav-link user-greeting">Xin chào, ${user.username || user.email}</span>
            <a href="#" class="nav-link" id="logout-btn">Đăng xuất</a>
            <a href="cart.html" class="nav-link cart-link">
                Giỏ hàng
                <span class="cart-count">0</span>
            </a>
        `;
        
        // Add logout handler
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                localStorage.removeItem('userId');
                window.location.href = 'index.html';
            });
        }
        
        // Update cart count again after changing HTML
        updateCartCount();
    }
    
    // Ensure all navigation links work properly
    document.querySelectorAll('.header-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && !link.id) {
            link.addEventListener('click', (e) => {
                // Allow default behavior for navigation
                console.log('Navigating to:', href);
            });
        }
    });
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await loadCommonComponents();
    initializeSearch();
});

// Export for use in other scripts
window.ComponentLoader = {
    loadComponent,
    updateCartCount
};
