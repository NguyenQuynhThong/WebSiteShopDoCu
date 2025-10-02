-- =============================================
-- PAYMENT & ORDERS SCHEMA
-- LAG VINTAGE SHOP
-- =============================================

USE lag_vintage_shop;

-- =============================================
-- TABLE: orders
-- Đơn hàng
-- =============================================

CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_code VARCHAR(50) UNIQUE NOT NULL,     -- Mã đơn hàng (ORDER-timestamp)
    
    -- Thông tin khách hàng
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT NOT NULL,
    
    -- Thông tin đơn hàng
    total_amount DECIMAL(15,2) NOT NULL,        -- Tổng tiền
    shipping_fee DECIMAL(15,2) DEFAULT 0,       -- Phí ship
    discount_amount DECIMAL(15,2) DEFAULT 0,    -- Giảm giá
    final_amount DECIMAL(15,2) NOT NULL,        -- Số tiền cuối cùng
    
    -- Trạng thái
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    order_status ENUM('pending', 'confirmed', 'shipping', 'completed', 'cancelled') DEFAULT 'pending',
    
    -- Thanh toán
    payment_method ENUM('qr', 'cod', 'card') DEFAULT 'qr',
    qr_code_url TEXT,                           -- URL mã QR
    transaction_id VARCHAR(255),                -- Mã giao dịch
    
    -- Ghi chú
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_order_code (order_code),
    INDEX idx_payment_status (payment_status),
    INDEX idx_order_status (order_status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: order_items
-- Chi tiết đơn hàng
-- =============================================

CREATE TABLE IF NOT EXISTS order_items (
    item_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    
    -- Thông tin sản phẩm tại thời điểm đặt hàng
    product_name VARCHAR(255) NOT NULL,
    product_image TEXT,
    price DECIMAL(15,2) NOT NULL,               -- Giá tại thời điểm mua
    quantity INT NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,            -- price * quantity
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT,
    
    -- Indexes
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: payments (Optional - tracking chi tiết)
-- =============================================

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    
    -- Thông tin thanh toán
    amount DECIMAL(15,2) NOT NULL,
    payment_method ENUM('qr', 'cod', 'card') DEFAULT 'qr',
    status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
    
    -- QR Code info
    bank_code VARCHAR(50),                      -- Mã ngân hàng (VCB, TCB, MB...)
    account_number VARCHAR(50),                 -- Số tài khoản
    account_name VARCHAR(255),                  -- Tên tài khoản
    qr_content TEXT,                            -- Nội dung chuyển khoản
    
    -- Transaction
    transaction_id VARCHAR(255),
    transaction_time TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_order_id (order_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- SAMPLE DATA
-- =============================================

SELECT 'Orders schema created/verified' AS status;

-- Hiển thị cấu trúc bảng
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE payments;
