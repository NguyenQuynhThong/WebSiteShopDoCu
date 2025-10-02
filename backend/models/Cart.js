const { pool: db } = require('../config/database');

class Cart {
    // Lấy giỏ hàng (theo user_id hoặc session_id)
    static async getCart(userId = null, sessionId = null) {
        try {
            let query = `
                SELECT 
                    c.cart_id,
                    c.product_id,
                    c.quantity,
                    c.added_at,
                    p.product_name as name,
                    p.price,
                    CASE 
                        WHEN p.image_url LIKE 'http%' THEN p.image_url
                        WHEN p.image_url LIKE '/images/%' THEN p.image_url
                        ELSE CONCAT('/images/', p.image_url)
                    END as image,
                    p.stock_quantity as stock,
                    (p.price * c.quantity) as subtotal
                FROM cart c
                JOIN products p ON c.product_id = p.product_id
                WHERE 
            `;
            
            const params = [];
            
            if (userId) {
                query += 'c.user_id = ?';
                params.push(userId);
            } else if (sessionId) {
                query += 'c.session_id = ?';
                params.push(sessionId);
            } else {
                return { success: false, message: 'Cần user_id hoặc session_id' };
            }
            
            query += ' ORDER BY c.added_at DESC';
            
            const [rows] = await db.query(query, params);
            
            // Calculate total
            const total = rows.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
            const totalItems = rows.reduce((sum, item) => sum + item.quantity, 0);
            
            return {
                success: true,
                cart: rows,
                summary: {
                    totalItems: totalItems,
                    total: total.toFixed(2)
                }
            };
        } catch (error) {
            console.error('Error in getCart:', error);
            return { success: false, message: error.message };
        }
    }

    // Thêm sản phẩm vào giỏ
    static async addToCart(productId, quantity = 1, userId = null, sessionId = null) {
        try {
            // Check if product exists and has stock
            const [product] = await db.query(
                'SELECT product_id, stock_quantity FROM products WHERE product_id = ?',
                [productId]
            );
            
            if (product.length === 0) {
                return { success: false, message: 'Sản phẩm không tồn tại' };
            }
            
            if (product[0].stock_quantity < quantity) {
                return { success: false, message: 'Sản phẩm không đủ số lượng trong kho' };
            }
            
            // Check if item already in cart
            let checkQuery = 'SELECT cart_id, quantity FROM cart WHERE product_id = ? AND ';
            const checkParams = [productId];
            
            if (userId) {
                checkQuery += 'user_id = ?';
                checkParams.push(userId);
            } else if (sessionId) {
                checkQuery += 'session_id = ?';
                checkParams.push(sessionId);
            } else {
                return { success: false, message: 'Cần user_id hoặc session_id' };
            }
            
            const [existing] = await db.query(checkQuery, checkParams);
            
            if (existing.length > 0) {
                // Update quantity
                const newQuantity = existing[0].quantity + quantity;
                
                if (product[0].stock_quantity < newQuantity) {
                    return { success: false, message: 'Không đủ số lượng trong kho' };
                }
                
                await db.query(
                    'UPDATE cart SET quantity = ? WHERE cart_id = ?',
                    [newQuantity, existing[0].cart_id]
                );
                
                return { success: true, message: 'Đã cập nhật số lượng trong giỏ hàng' };
            } else {
                // Insert new item
                await db.query(
                    'INSERT INTO cart (user_id, session_id, product_id, quantity) VALUES (?, ?, ?, ?)',
                    [userId, sessionId, productId, quantity]
                );
                
                return { success: true, message: 'Đã thêm vào giỏ hàng' };
            }
        } catch (error) {
            console.error('Error in addToCart:', error);
            return { success: false, message: error.message };
        }
    }

    // Cập nhật số lượng
    static async updateQuantity(cartId, quantity, userId = null, sessionId = null) {
        try {
            // Check ownership
            let checkQuery = 'SELECT cart_id, product_id FROM cart WHERE cart_id = ? AND ';
            const checkParams = [cartId];
            
            if (userId) {
                checkQuery += 'user_id = ?';
                checkParams.push(userId);
            } else if (sessionId) {
                checkQuery += 'session_id = ?';
                checkParams.push(sessionId);
            } else {
                return { success: false, message: 'Cần user_id hoặc session_id' };
            }
            
            const [cartItem] = await db.query(checkQuery, checkParams);
            
            if (cartItem.length === 0) {
                return { success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
            }
            
            // Check stock
            const [product] = await db.query(
                'SELECT stock_quantity FROM products WHERE product_id = ?',
                [cartItem[0].product_id]
            );
            
            if (product[0].stock_quantity < quantity) {
                return { success: false, message: 'Không đủ số lượng trong kho' };
            }
            
            // Update quantity
            await db.query('UPDATE cart SET quantity = ? WHERE cart_id = ?', [quantity, cartId]);
            
            return { success: true, message: 'Đã cập nhật số lượng' };
        } catch (error) {
            console.error('Error in updateQuantity:', error);
            return { success: false, message: error.message };
        }
    }

    // Xóa sản phẩm khỏi giỏ
    static async removeFromCart(cartId, userId = null, sessionId = null) {
        try {
            let query = 'DELETE FROM cart WHERE cart_id = ? AND ';
            const params = [cartId];
            
            if (userId) {
                query += 'user_id = ?';
                params.push(userId);
            } else if (sessionId) {
                query += 'session_id = ?';
                params.push(sessionId);
            } else {
                return { success: false, message: 'Cần user_id hoặc session_id' };
            }
            
            const [result] = await db.query(query, params);
            
            if (result.affectedRows === 0) {
                return { success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' };
            }
            
            return { success: true, message: 'Đã xóa khỏi giỏ hàng' };
        } catch (error) {
            console.error('Error in removeFromCart:', error);
            return { success: false, message: error.message };
        }
    }

    // Xóa toàn bộ giỏ hàng
    static async clearCart(userId = null, sessionId = null) {
        try {
            let query = 'DELETE FROM cart WHERE ';
            const params = [];
            
            if (userId) {
                query += 'user_id = ?';
                params.push(userId);
            } else if (sessionId) {
                query += 'session_id = ?';
                params.push(sessionId);
            } else {
                return { success: false, message: 'Cần user_id hoặc session_id' };
            }
            
            await db.query(query, params);
            
            return { success: true, message: 'Đã xóa toàn bộ giỏ hàng' };
        } catch (error) {
            console.error('Error in clearCart:', error);
            return { success: false, message: error.message };
        }
    }

    // Chuyển giỏ hàng từ session sang user (khi đăng nhập)
    static async mergeCart(sessionId, userId) {
        try {
            // Get session cart
            const [sessionCart] = await db.query(
                'SELECT product_id, quantity FROM cart WHERE session_id = ?',
                [sessionId]
            );
            
            // Get user cart
            const [userCart] = await db.query(
                'SELECT product_id, quantity FROM cart WHERE user_id = ?',
                [userId]
            );
            
            // Merge items
            for (const sessionItem of sessionCart) {
                const userItem = userCart.find(item => item.product_id === sessionItem.product_id);
                
                if (userItem) {
                    // Update quantity in user cart
                    await db.query(
                        'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                        [sessionItem.quantity, userId, sessionItem.product_id]
                    );
                } else {
                    // Move item to user cart
                    await db.query(
                        'UPDATE cart SET user_id = ?, session_id = NULL WHERE session_id = ? AND product_id = ?',
                        [userId, sessionId, sessionItem.product_id]
                    );
                }
            }
            
            // Delete remaining session cart items
            await db.query('DELETE FROM cart WHERE session_id = ?', [sessionId]);
            
            return { success: true, message: 'Đã hợp nhất giỏ hàng' };
        } catch (error) {
            console.error('Error in mergeCart:', error);
            return { success: false, message: error.message };
        }
    }
}

module.exports = Cart;
