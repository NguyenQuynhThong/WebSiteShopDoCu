// =============================================
// ORDER MODEL - LAG VINTAGE SHOP
// Làm việc với database hiện có
// =============================================

const { pool: db } = require('../config/database');

class Order {
    // =============================================
    // Tạo đơn hàng mới từ giỏ hàng
    // =============================================
    static async createOrder(userId, orderData) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // 1. Tạo order code
            const orderCode = 'ORDER-' + Date.now();
            
            // 2. Insert vào bảng orders
            const [orderResult] = await connection.query(`
                INSERT INTO orders (
                    order_code, user_id, 
                    customer_name, customer_email, customer_phone,
                    shipping_address, shipping_district, shipping_city,
                    payment_method, order_status,
                    subtotal, shipping_fee, total_amount,
                    notes, order_date
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
                orderCode,
                userId,
                orderData.customer_name,
                orderData.customer_email,
                orderData.customer_phone,
                orderData.shipping_address,
                orderData.shipping_district || 'Quận/Huyện',
                orderData.shipping_city || 'TP.HCM',
                orderData.payment_method || 'bank',
                'pending',
                orderData.subtotal,
                orderData.shipping_fee || 0,
                orderData.total_amount,
                orderData.notes || null
            ]);
            
            const orderId = orderResult.insertId;
            
            // 3. Lấy items từ giỏ hàng
            const [cartItems] = await connection.query(`
                SELECT 
                    c.product_id,
                    c.quantity,
                    p.product_name,
                    p.image_url,
                    p.price,
                    (c.quantity * p.price) as item_total
                FROM cart c
                JOIN products p ON c.product_id = p.product_id
                WHERE c.user_id = ?
            `, [userId]);
            
            if (cartItems.length === 0) {
                throw new Error('Giỏ hàng trống');
            }
            
            // 4. Insert vào order_items
            for (const item of cartItems) {
                await connection.query(`
                    INSERT INTO order_items (
                        order_id, product_id, product_name, product_image,
                        price, quantity, item_total
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [
                    orderId,
                    item.product_id,
                    item.product_name,
                    item.image_url,
                    item.price,
                    item.quantity,
                    item.item_total
                ]);
                
                // 5. Giảm stock quantity
                await connection.query(`
                    UPDATE products 
                    SET stock_quantity = stock_quantity - ? 
                    WHERE product_id = ?
                `, [item.quantity, item.product_id]);
            }
            
            // 6. Xóa giỏ hàng
            await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);
            
            await connection.commit();
            
            return {
                success: true,
                message: 'Đơn hàng đã được tạo',
                order: {
                    order_id: orderId,
                    order_code: orderCode,
                    total_amount: orderData.total_amount
                }
            };
            
        } catch (error) {
            await connection.rollback();
            console.error('Create order error:', error);
            return {
                success: false,
                message: error.message
            };
        } finally {
            connection.release();
        }
    }
    
    // =============================================
    // Lấy danh sách đơn hàng của user
    // =============================================
    static async getOrdersByUser(userId) {
        try {
            const [orders] = await db.query(`
                SELECT 
                    o.*,
                    COUNT(oi.order_item_id) as total_items,
                    p.payment_status,
                    p.transaction_id
                FROM orders o
                LEFT JOIN order_items oi ON o.order_id = oi.order_id
                LEFT JOIN payments p ON o.order_id = p.order_id
                WHERE o.user_id = ?
                GROUP BY o.order_id
                ORDER BY o.order_date DESC
            `, [userId]);
            
            // Lấy items cho mỗi order (để hiển thị preview)
            for (let order of orders) {
                const [items] = await db.query(`
                    SELECT 
                        product_id,
                        product_name as name,
                        product_image as image,
                        price,
                        quantity,
                        item_total as subtotal
                    FROM order_items
                    WHERE order_id = ?
                    LIMIT 3
                `, [order.order_id]);
                
                order.items = items;
            }
            
            return {
                success: true,
                orders: orders
            };
        } catch (error) {
            console.error('Get orders error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // =============================================
    // Lấy TẤT CẢ đơn hàng (Admin)
    // =============================================
    static async getAllOrders() {
        try {
            const [orders] = await db.query(`
                SELECT 
                    o.order_id,
                    o.order_code,
                    o.customer_name as full_name,
                    o.customer_email,
                    o.customer_phone,
                    o.shipping_address,
                    o.payment_method,
                    o.order_status as status,
                    o.total_amount,
                    o.order_date as created_at,
                    COUNT(oi.order_item_id) as total_items,
                    MAX(p.payment_status) as payment_status
                FROM orders o
                LEFT JOIN order_items oi ON o.order_id = oi.order_id
                LEFT JOIN payments p ON o.order_id = p.order_id
                GROUP BY o.order_id, o.order_code, o.customer_name, o.customer_email, 
                         o.customer_phone, o.shipping_address, o.payment_method, 
                         o.order_status, o.total_amount, o.order_date
                ORDER BY o.order_date DESC
            `);
            
            return {
                success: true,
                orders: orders
            };
        } catch (error) {
            console.error('Get all orders error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // =============================================
    // Lấy chi tiết đơn hàng
    // =============================================
    static async getOrderDetail(orderId, userId) {
        try {
            // Lấy thông tin order
            const [orders] = await db.query(`
                SELECT o.*, p.payment_status, p.transaction_id, p.payment_date
                FROM orders o
                LEFT JOIN payments p ON o.order_id = p.order_id
                WHERE o.order_id = ? AND o.user_id = ?
            `, [orderId, userId]);
            
            if (orders.length === 0) {
                return {
                    success: false,
                    message: 'Không tìm thấy đơn hàng'
                };
            }
            
            // Lấy items với thông tin sản phẩm
            const [items] = await db.query(`
                SELECT oi.*, 
                       pr.product_name, 
                       CASE 
                           WHEN pr.image_url LIKE 'http%' THEN pr.image_url
                           WHEN pr.image_url LIKE '/images/%' THEN pr.image_url
                           WHEN pr.image_url LIKE '../backend/images/%' THEN CONCAT('/images/', REPLACE(pr.image_url, '../backend/images/', ''))
                           ELSE CONCAT('/images/', pr.image_url)
                       END as image,
                       pr.price as current_price
                FROM order_items oi
                LEFT JOIN products pr ON oi.product_id = pr.product_id
                WHERE oi.order_id = ?
            `, [orderId]);
            
            return {
                success: true,
                order: orders[0],
                items: items
            };
        } catch (error) {
            console.error('Get order detail error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // =============================================
    // Cập nhật trạng thái đơn hàng
    // =============================================
    static async updateOrderStatus(orderId, status) {
        try {
            await db.query(`
                UPDATE orders 
                SET order_status = ?, updated_at = NOW()
                WHERE order_id = ?
            `, [status, orderId]);
            
            return {
                success: true,
                message: 'Đã cập nhật trạng thái đơn hàng'
            };
        } catch (error) {
            console.error('Update order status error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // =============================================
    // Hủy đơn hàng
    // =============================================
    static async cancelOrder(orderId, userId) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Kiểm tra order
            const [orders] = await connection.query(`
                SELECT * FROM orders 
                WHERE order_id = ? AND user_id = ?
            `, [orderId, userId]);
            
            if (orders.length === 0) {
                throw new Error('Không tìm thấy đơn hàng');
            }
            
            if (orders[0].order_status !== 'pending') {
                throw new Error('Chỉ có thể hủy đơn hàng đang chờ xử lý');
            }
            
            // Hoàn lại stock
            const [items] = await connection.query(`
                SELECT product_id, quantity FROM order_items
                WHERE order_id = ?
            `, [orderId]);
            
            for (const item of items) {
                await connection.query(`
                    UPDATE products 
                    SET stock_quantity = stock_quantity + ?
                    WHERE product_id = ?
                `, [item.quantity, item.product_id]);
            }
            
            // Cập nhật status
            await connection.query(`
                UPDATE orders 
                SET order_status = 'cancelled', updated_at = NOW()
                WHERE order_id = ?
            `, [orderId]);
            
            await connection.commit();
            
            return {
                success: true,
                message: 'Đã hủy đơn hàng'
            };
            
        } catch (error) {
            await connection.rollback();
            console.error('Cancel order error:', error);
            return {
                success: false,
                message: error.message
            };
        } finally {
            connection.release();
        }
    }
}

module.exports = Order;
