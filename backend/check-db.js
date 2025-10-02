// Script để kiểm tra database
const { pool } = require('./config/database');

async function checkDatabase() {
    try {
        console.log('='.repeat(50));
        console.log('KIỂM TRA DATABASE');
        console.log('='.repeat(50));
        
        // Kiểm tra các bảng
        console.log('\n1. Các bảng trong database:');
        const [tables] = await pool.query('SHOW TABLES');
        tables.forEach(table => {
            console.log('  -', Object.values(table)[0]);
        });
        
        // Kiểm tra bảng cart
        console.log('\n2. Kiểm tra bảng cart:');
        try {
            const [cartInfo] = await pool.query('DESCRIBE cart');
            console.log('   ✓ Bảng cart tồn tại:');
            cartInfo.forEach(col => {
                console.log(`     - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
            });
            
            // Đếm số items trong cart
            const [count] = await pool.query('SELECT COUNT(*) as total FROM cart');
            console.log(`\n   Số lượng items trong giỏ hàng: ${count[0].total}`);
            
            // Hiển thị dữ liệu cart nếu có
            if (count[0].total > 0) {
                const [cartItems] = await pool.query('SELECT * FROM cart LIMIT 5');
                console.log('\n   Dữ liệu mẫu (5 items đầu):');
                cartItems.forEach(item => {
                    console.log(`     - Cart ID: ${item.cart_id}, Product ID: ${item.product_id}, Quantity: ${item.quantity}, User: ${item.user_id || 'Guest'}`);
                });
            }
            
        } catch (error) {
            console.log('   ✗ Bảng cart KHÔNG tồn tại!');
            console.log('   → Cần tạo bảng cart');
            
            // Tạo bảng cart
            console.log('\n3. Đang tạo bảng cart...');
            await pool.query(`
                CREATE TABLE cart (
                    cart_id INT PRIMARY KEY AUTO_INCREMENT,
                    user_id INT NULL,
                    session_id VARCHAR(255) NULL,
                    product_id INT NOT NULL,
                    quantity INT NOT NULL DEFAULT 1,
                    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    
                    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
                    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                    
                    INDEX idx_user_id (user_id),
                    INDEX idx_session_id (session_id),
                    INDEX idx_product_id (product_id),
                    
                    CONSTRAINT chk_quantity CHECK (quantity > 0)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('   ✓ Đã tạo bảng cart thành công!');
        }
        
        // Kiểm tra bảng users
        console.log('\n4. Kiểm tra bảng users:');
        try {
            const [usersCount] = await pool.query('SELECT COUNT(*) as total FROM users');
            console.log(`   ✓ Bảng users tồn tại với ${usersCount[0].total} users`);
        } catch (error) {
            console.log('   ✗ Bảng users không tồn tại!');
        }
        
        // Kiểm tra bảng products
        console.log('\n5. Kiểm tra bảng products:');
        try {
            const [productsCount] = await pool.query('SELECT COUNT(*) as total FROM products');
            console.log(`   ✓ Bảng products tồn tại với ${productsCount[0].total} sản phẩm`);
        } catch (error) {
            console.log('   ✗ Bảng products không tồn tại!');
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('HOÀN THÀNH KIỂM TRA');
        console.log('='.repeat(50));
        
    } catch (error) {
        console.error('Lỗi:', error.message);
    } finally {
        process.exit(0);
    }
}

checkDatabase();
