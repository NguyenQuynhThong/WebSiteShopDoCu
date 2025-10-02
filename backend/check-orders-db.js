// Kiểm tra database hiện tại - Orders & Payments
const { pool } = require('./config/database');

async function checkOrdersDatabase() {
    try {
        console.log('='.repeat(70));
        console.log('KIỂM TRA DATABASE - ORDERS & PAYMENTS');
        console.log('='.repeat(70));
        
        // 1. Kiểm tra bảng orders
        console.log('\n1. Kiểm tra bảng ORDERS:');
        try {
            const [ordersInfo] = await pool.query('DESCRIBE orders');
            console.log('   ✓ Bảng orders tồn tại với các cột:');
            ordersInfo.forEach(col => {
                console.log(`     - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'} ${col.Key ? `[${col.Key}]` : ''}`);
            });
            
            // Đếm số orders
            const [orderCount] = await pool.query('SELECT COUNT(*) as total FROM orders');
            console.log(`\n   Số lượng đơn hàng: ${orderCount[0].total}`);
            
            // Hiển thị mẫu
            if (orderCount[0].total > 0) {
                const [sampleOrders] = await pool.query(`
                    SELECT order_id, order_code, user_id, customer_name, 
                           final_amount, payment_status, order_status, created_at
                    FROM orders 
                    ORDER BY created_at DESC 
                    LIMIT 5
                `);
                console.log('\n   Đơn hàng gần đây (5 đơn):');
                sampleOrders.forEach(order => {
                    console.log(`     - ${order.order_code}: ${order.customer_name} - ${order.final_amount}₫ - ${order.payment_status}/${order.order_status}`);
                });
            }
            
        } catch (error) {
            console.log('   ✗ Bảng orders KHÔNG tồn tại!');
            console.log('   → Cần tạo bảng orders');
        }
        
        // 2. Kiểm tra bảng order_items
        console.log('\n2. Kiểm tra bảng ORDER_ITEMS:');
        try {
            const [itemsInfo] = await pool.query('DESCRIBE order_items');
            console.log('   ✓ Bảng order_items tồn tại với các cột:');
            itemsInfo.forEach(col => {
                console.log(`     - ${col.Field}: ${col.Type}`);
            });
            
            const [itemCount] = await pool.query('SELECT COUNT(*) as total FROM order_items');
            console.log(`\n   Số lượng items: ${itemCount[0].total}`);
            
        } catch (error) {
            console.log('   ✗ Bảng order_items KHÔNG tồn tại!');
        }
        
        // 3. Kiểm tra bảng payments
        console.log('\n3. Kiểm tra bảng PAYMENTS:');
        try {
            const [paymentsInfo] = await pool.query('DESCRIBE payments');
            console.log('   ✓ Bảng payments tồn tại với các cột:');
            paymentsInfo.forEach(col => {
                console.log(`     - ${col.Field}: ${col.Type}`);
            });
            
            const [paymentCount] = await pool.query('SELECT COUNT(*) as total FROM payments');
            console.log(`\n   Số lượng giao dịch: ${paymentCount[0].total}`);
            
        } catch (error) {
            console.log('   ✗ Bảng payments KHÔNG tồn tại!');
        }
        
        // 4. Kiểm tra các bảng liên quan
        console.log('\n4. Các bảng liên quan:');
        const [tables] = await pool.query('SHOW TABLES');
        const tableNames = tables.map(t => Object.values(t)[0]);
        console.log('   Tất cả các bảng trong database:');
        tableNames.forEach(name => {
            const indicator = ['orders', 'order_items', 'payments'].includes(name) ? '✓' : '-';
            console.log(`     ${indicator} ${name}`);
        });
        
        // 5. Thống kê
        console.log('\n5. Thống kê tổng quan:');
        try {
            const [stats] = await pool.query(`
                SELECT 
                    (SELECT COUNT(*) FROM orders) as total_orders,
                    (SELECT COUNT(*) FROM orders WHERE payment_status = 'paid') as paid_orders,
                    (SELECT COUNT(*) FROM orders WHERE payment_status = 'pending') as pending_orders,
                    (SELECT SUM(final_amount) FROM orders WHERE payment_status = 'paid') as total_revenue,
                    (SELECT COUNT(*) FROM order_items) as total_items
            `);
            
            if (stats[0]) {
                console.log(`   - Tổng đơn hàng: ${stats[0].total_orders || 0}`);
                console.log(`   - Đã thanh toán: ${stats[0].paid_orders || 0}`);
                console.log(`   - Chờ thanh toán: ${stats[0].pending_orders || 0}`);
                console.log(`   - Tổng doanh thu: ${(stats[0].total_revenue || 0).toLocaleString('vi-VN')}₫`);
                console.log(`   - Tổng sản phẩm đã bán: ${stats[0].total_items || 0}`);
            }
        } catch (error) {
            console.log('   Chưa có dữ liệu để thống kê');
        }
        
        console.log('\n' + '='.repeat(70));
        console.log('KẾT LUẬN:');
        
        const hasOrders = tableNames.includes('orders');
        const hasOrderItems = tableNames.includes('order_items');
        const hasPayments = tableNames.includes('payments');
        
        if (hasOrders && hasOrderItems && hasPayments) {
            console.log('✓ Database đã sẵn sàng cho chức năng thanh toán!');
        } else {
            console.log('✗ Cần tạo các bảng còn thiếu:');
            if (!hasOrders) console.log('  - orders');
            if (!hasOrderItems) console.log('  - order_items');
            if (!hasPayments) console.log('  - payments');
        }
        console.log('='.repeat(70));
        
    } catch (error) {
        console.error('Lỗi:', error.message);
    } finally {
        process.exit(0);
    }
}

checkOrdersDatabase();
