const { pool: db } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    // Đăng ký user mới
    static async register(email, password, fullName, phone = null) {
        try {
            // Check if email already exists
            const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
            if (existing.length > 0) {
                return { success: false, message: 'Email đã được sử dụng' };
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert new user
            const [result] = await db.query(
                'INSERT INTO users (email, password, full_name, phone, role, status) VALUES (?, ?, ?, ?, ?, ?)',
                [email, hashedPassword, fullName, phone, 'customer', 'active']
            );

            return {
                success: true,
                message: 'Đăng ký thành công',
                userId: result.insertId
            };
        } catch (error) {
            console.error('Error in register:', error);
            return { success: false, message: error.message };
        }
    }

    // Đăng nhập
    static async login(email, password) {
        try {
            const [rows] = await db.query(
                'SELECT user_id, email, password, full_name, phone, role, status FROM users WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return { success: false, message: 'Email hoặc mật khẩu không đúng' };
            }

            const user = rows[0];

            // Check if account is active
            if (user.status !== 'active') {
                return { success: false, message: 'Tài khoản đã bị khóa' };
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { success: false, message: 'Email hoặc mật khẩu không đúng' };
            }

            // Update last login
            await db.query('UPDATE users SET last_login = NOW() WHERE user_id = ?', [user.user_id]);

            // Return user data (without password)
            return {
                success: true,
                message: 'Đăng nhập thành công',
                user: {
                    userId: user.user_id,
                    email: user.email,
                    fullName: user.full_name,
                    phone: user.phone,
                    role: user.role
                }
            };
        } catch (error) {
            console.error('Error in login:', error);
            return { success: false, message: error.message };
        }
    }

    // Lấy thông tin user theo ID
    static async getById(userId) {
        try {
            const [rows] = await db.query(`
                SELECT 
                    u.user_id,
                    u.email,
                    u.full_name,
                    u.phone,
                    u.role,
                    u.status,
                    u.created_at,
                    u.last_login,
                    COUNT(DISTINCT o.order_id) as total_orders,
                    COALESCE(SUM(o.total_amount), 0) as total_spent
                FROM users u
                LEFT JOIN orders o ON u.user_id = o.user_id
                WHERE u.user_id = ?
                GROUP BY u.user_id
            `, [userId]);

            if (rows.length === 0) {
                return { success: false, message: 'Không tìm thấy user' };
            }

            return {
                success: true,
                data: rows[0]
            };
        } catch (error) {
            console.error('Error in getById:', error);
            return { success: false, message: error.message };
        }
    }

    // Cập nhật thông tin user
    static async updateProfile(userId, fullName, phone) {
        try {
            await db.query(
                'UPDATE users SET full_name = ?, phone = ? WHERE user_id = ?',
                [fullName, phone, userId]
            );

            return { success: true, message: 'Cập nhật thông tin thành công' };
        } catch (error) {
            console.error('Error in updateProfile:', error);
            return { success: false, message: error.message };
        }
    }

    // Đổi mật khẩu
    static async changePassword(userId, oldPassword, newPassword) {
        try {
            // Get current password
            const [rows] = await db.query('SELECT password FROM users WHERE user_id = ?', [userId]);
            if (rows.length === 0) {
                return { success: false, message: 'Không tìm thấy user' };
            }

            // Verify old password
            const isPasswordValid = await bcrypt.compare(oldPassword, rows[0].password);
            if (!isPasswordValid) {
                return { success: false, message: 'Mật khẩu cũ không đúng' };
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            await db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, userId]);

            return { success: true, message: 'Đổi mật khẩu thành công' };
        } catch (error) {
            console.error('Error in changePassword:', error);
            return { success: false, message: error.message };
        }
    }

    // Lấy tất cả khách hàng (Admin)
    static async getAllCustomers() {
        try {
            const [customers] = await db.query(`
                SELECT 
                    u.user_id,
                    u.email,
                    u.full_name,
                    u.phone,
                    u.role,
                    u.status,
                    u.created_at,
                    u.last_login,
                    COUNT(DISTINCT o.order_id) as total_orders,
                    COALESCE(SUM(o.total_amount), 0) as total_spent
                FROM users u
                LEFT JOIN orders o ON u.user_id = o.user_id
                WHERE u.role = 'customer'
                GROUP BY u.user_id, u.email, u.full_name, u.phone, u.role, u.status, u.created_at, u.last_login
                ORDER BY u.created_at DESC
            `);

            return {
                success: true,
                customers: customers
            };
        } catch (error) {
            console.error('Error in getAllCustomers:', error);
            return { success: false, message: error.message };
        }
    }
}

module.exports = User;
