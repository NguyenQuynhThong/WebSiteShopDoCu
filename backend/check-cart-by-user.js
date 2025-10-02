// Kiểm tra phân bố giỏ hàng theo user
const { pool } = require('./config/database');

async function checkCartByUser() {
    try {
        console.log('='.repeat(60));
        console.log('KIỂM TRA GIỎ HÀNG THEO USER');
        console.log('='.repeat(60));
        
        // Tổng số items trong giỏ hàng
        const [total] = await pool.query('SELECT COUNT(*) as total FROM cart');
        console.log(`\nTổng số items trong database: ${total[0].total}`);
        
        // Phân bố theo user
        console.log('\n1. Giỏ hàng theo User ID:');
        const [byUser] = await pool.query(`
            SELECT 
                user_id, 
                COUNT(*) as items,
                SUM(quantity) as total_quantity
            FROM cart 
            WHERE user_id IS NOT NULL 
            GROUP BY user_id
            ORDER BY user_id
        `);
        
        byUser.forEach(row => {
            console.log(`   User ${row.user_id}: ${row.items} sản phẩm khác nhau, ${row.total_quantity} items`);
        });
        
        // Guest cart (session_id)
        console.log('\n2. Giỏ hàng Guest (session_id):');
        const [bySession] = await pool.query(`
            SELECT 
                session_id, 
                COUNT(*) as items,
                SUM(quantity) as total_quantity
            FROM cart 
            WHERE session_id IS NOT NULL 
            GROUP BY session_id
        `);
        
        if (bySession.length > 0) {
            bySession.forEach(row => {
                console.log(`   Session ${row.session_id}: ${row.items} sản phẩm khác nhau, ${row.total_quantity} items`);
            });
        } else {
            console.log('   Không có giỏ hàng guest');
        }
        
        // Chi tiết từng user
        console.log('\n3. Chi tiết giỏ hàng từng user:');
        const [details] = await pool.query(`
            SELECT 
                c.user_id,
                c.cart_id,
                c.product_id,
                p.product_name,
                c.quantity,
                p.price,
                (c.quantity * p.price) as subtotal
            FROM cart c
            JOIN products p ON c.product_id = p.product_id
            WHERE c.user_id IS NOT NULL
            ORDER BY c.user_id, c.cart_id
        `);
        
        let currentUser = null;
        let userTotal = 0;
        
        details.forEach(item => {
            if (currentUser !== item.user_id) {
                if (currentUser !== null) {
                    console.log(`   → Tổng: ${userTotal.toLocaleString('vi-VN')}₫\n`);
                }
                currentUser = item.user_id;
                userTotal = 0;
                console.log(`   User ${item.user_id}:`);
            }
            console.log(`     - ${item.product_name} (x${item.quantity}): ${parseFloat(item.subtotal).toLocaleString('vi-VN')}₫`);
            userTotal += parseFloat(item.subtotal);
        });
        
        if (currentUser !== null) {
            console.log(`   → Tổng: ${userTotal.toLocaleString('vi-VN')}₫`);
        }
        
        console.log('\n' + '='.repeat(60));
        
    } catch (error) {
        console.error('Lỗi:', error.message);
    } finally {
        process.exit(0);
    }
}

checkCartByUser();
