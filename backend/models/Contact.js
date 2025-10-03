// =============================================
// CONTACT MODEL - LAG VINTAGE SHOP
// =============================================
// Model xử lý các thao tác với bảng contacts
// =============================================

const { pool } = require('../config/database');

class Contact {
    // Lấy tất cả liên hệ (với phân trang và lọc)
    static async getAll(filters = {}) {
        try {
            let query = 'SELECT * FROM contacts';
            const params = [];
            const conditions = [];

            // Lọc theo is_read
            if (filters.is_read !== undefined) {
                conditions.push('is_read = ?');
                params.push(filters.is_read);
            }

            // Lọc theo is_replied
            if (filters.is_replied !== undefined) {
                conditions.push('is_replied = ?');
                params.push(filters.is_replied);
            }

            // Lọc theo subject
            if (filters.subject) {
                conditions.push('subject = ?');
                params.push(filters.subject);
            }

            // Tìm kiếm theo tên hoặc email
            if (filters.search) {
                conditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
                params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
            }

            // Thêm điều kiện vào query
            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            // Sắp xếp theo thời gian tạo mới nhất
            query += ' ORDER BY created_at DESC';

            // Phân trang
            if (filters.limit) {
                query += ' LIMIT ?';
                params.push(parseInt(filters.limit));
                
                if (filters.offset) {
                    query += ' OFFSET ?';
                    params.push(parseInt(filters.offset));
                }
            }

            const [rows] = await pool.query(query, params);
            return rows;
        } catch (error) {
            console.error('Error in Contact.getAll:', error);
            throw error;
        }
    }

    // Lấy thông tin một liên hệ theo ID
    static async getById(id) {
        try {
            const [rows] = await pool.query(
                'SELECT * FROM contacts WHERE contact_id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error in Contact.getById:', error);
            throw error;
        }
    }

    // Tạo liên hệ mới
    static async create(contactData) {
        try {
            const { first_name, last_name, email, phone, subject, message, subscribe_newsletter } = contactData;
            
            const [result] = await pool.query(
                `INSERT INTO contacts (first_name, last_name, email, phone, subject, message, subscribe_newsletter) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [first_name, last_name, email, phone, subject, message, subscribe_newsletter || false]
            );

            return {
                contact_id: result.insertId,
                first_name,
                last_name,
                email,
                phone,
                subject,
                message,
                subscribe_newsletter: subscribe_newsletter || false
            };
        } catch (error) {
            console.error('Error in Contact.create:', error);
            throw error;
        }
    }

    // Đánh dấu đã đọc
    static async markAsRead(id) {
        try {
            const [result] = await pool.query(
                'UPDATE contacts SET is_read = TRUE WHERE contact_id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in Contact.markAsRead:', error);
            throw error;
        }
    }

    // Đánh dấu đã trả lời
    static async markAsReplied(id) {
        try {
            const [result] = await pool.query(
                'UPDATE contacts SET is_replied = TRUE WHERE contact_id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in Contact.markAsReplied:', error);
            throw error;
        }
    }

    // Xóa liên hệ
    static async delete(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM contacts WHERE contact_id = ?',
                [id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error in Contact.delete:', error);
            throw error;
        }
    }

    // Đếm số liên hệ theo trạng thái
    static async countByStatus() {
        try {
            const [rows] = await pool.query(
                `SELECT 
                    COUNT(*) as total,
                    SUM(is_read = 0) as unread,
                    SUM(is_read = 1) as \`read\`,
                    SUM(is_replied = 0) as not_replied,
                    SUM(is_replied = 1) as replied
                 FROM contacts`
            );

            return rows[0];
        } catch (error) {
            console.error('Error in Contact.countByStatus:', error);
            throw error;
        }
    }

    // Lấy tổng số liên hệ (cho phân trang)
    static async getTotalCount(filters = {}) {
        try {
            let query = 'SELECT COUNT(*) as total FROM contacts';
            const params = [];
            const conditions = [];

            if (filters.is_read !== undefined) {
                conditions.push('is_read = ?');
                params.push(filters.is_read);
            }

            if (filters.is_replied !== undefined) {
                conditions.push('is_replied = ?');
                params.push(filters.is_replied);
            }

            if (filters.subject) {
                conditions.push('subject = ?');
                params.push(filters.subject);
            }

            if (filters.search) {
                conditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
                params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            const [rows] = await pool.query(query, params);
            return rows[0].total;
        } catch (error) {
            console.error('Error in Contact.getTotalCount:', error);
            throw error;
        }
    }
}

module.exports = Contact;

