// =============================================
// CONTACTS ROUTES - LAG VINTAGE SHOP
// =============================================
// API endpoints cho chức năng liên hệ
// =============================================

const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { verifyToken, isAdmin } = require('../middleware/auth');

// =============================================
// PUBLIC ROUTES (Không cần đăng nhập)
// =============================================

// Tạo liên hệ mới (cho khách hàng)
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, subject, message, subscribe_newsletter } = req.body;

        // Validate dữ liệu
        if (!first_name || !last_name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin bắt buộc'
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }

        // Validate subject
        const validSubjects = ['general', 'order', 'product', 'shipping', 'return', 'complaint', 'other'];
        if (!validSubjects.includes(subject)) {
            return res.status(400).json({
                success: false,
                message: 'Chủ đề không hợp lệ'
            });
        }

        // Tạo liên hệ mới
        const contact = await Contact.create({
            first_name,
            last_name,
            email,
            phone: phone || null,
            subject,
            message,
            subscribe_newsletter: subscribe_newsletter || false
        });

        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.',
            data: contact
        });

    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi gửi tin nhắn',
            error: error.message
        });
    }
});

// =============================================
// ADMIN ROUTES (Cần quyền admin)
// =============================================

// Lấy tất cả liên hệ (có phân trang và lọc)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const { is_read, is_replied, subject, search, page = 1, limit = 20 } = req.query;

        // Tính offset cho phân trang
        const offset = (page - 1) * limit;

        // Chuyển đổi string sang boolean cho is_read và is_replied
        const filters = {
            subject,
            search,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };

        if (is_read !== undefined) {
            filters.is_read = is_read === 'true' || is_read === '1';
        }

        if (is_replied !== undefined) {
            filters.is_replied = is_replied === 'true' || is_replied === '1';
        }

        // Lấy danh sách liên hệ
        const contacts = await Contact.getAll(filters);

        // Lấy tổng số liên hệ
        const total = await Contact.getTotalCount(filters);

        // Lấy thống kê
        const stats = await Contact.countByStatus();

        res.json({
            success: true,
            data: contacts,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            },
            stats
        });

    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy danh sách liên hệ',
            error: error.message
        });
    }
});

// Lấy chi tiết một liên hệ
router.get('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.getById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy liên hệ'
            });
        }

        res.json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Error getting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thông tin liên hệ',
            error: error.message
        });
    }
});

// Cập nhật trạng thái đã đọc
router.put('/:id/read', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Contact.markAsRead(id);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy liên hệ'
            });
        }

        res.json({
            success: true,
            message: 'Đã đánh dấu đã đọc'
        });

    } catch (error) {
        console.error('Error marking contact as read:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái',
            error: error.message
        });
    }
});

// Đánh dấu đã trả lời
router.put('/:id/replied', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const updated = await Contact.markAsReplied(id);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy liên hệ'
            });
        }

        res.json({
            success: true,
            message: 'Đã đánh dấu đã trả lời'
        });

    } catch (error) {
        console.error('Error marking contact as replied:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi cập nhật trạng thái',
            error: error.message
        });
    }
});

// Xóa liên hệ
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Contact.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy liên hệ'
            });
        }

        res.json({
            success: true,
            message: 'Xóa liên hệ thành công'
        });

    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa liên hệ',
            error: error.message
        });
    }
});

// Lấy thống kê liên hệ
router.get('/stats/summary', verifyToken, isAdmin, async (req, res) => {
    try {
        const stats = await Contact.countByStatus();
        const total = await Contact.getTotalCount();

        res.json({
            success: true,
            data: {
                total,
                byStatus: stats
            }
        });

    } catch (error) {
        console.error('Error getting contact stats:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi lấy thống kê',
            error: error.message
        });
    }
});

module.exports = router;
