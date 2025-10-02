const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Đăng ký
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName, phone } = req.body;
        
        // Validation
        if (!email || !password || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }
        
        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }
        
        const result = await User.register(email, password, fullName, phone);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền email và mật khẩu'
            });
        }
        
        const result = await User.login(email, password);
        
        if (result.success) {
            // Set session/cookie if needed
            res.json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Lấy danh sách tất cả khách hàng (Admin)
router.get('/', async (req, res) => {
    try {
        const result = await User.getAllCustomers();
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Get all customers error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Lấy thông tin user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await User.getById(userId);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Cập nhật thông tin
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, phone } = req.body;
        
        if (!fullName) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền họ tên'
            });
        }
        
        const result = await User.updateProfile(userId, fullName, phone);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Đổi mật khẩu
router.put('/:userId/change-password', async (req, res) => {
    try {
        const { userId } = req.params;
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin'
            });
        }
        
        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
            });
        }
        
        const result = await User.changePassword(userId, oldPassword, newPassword);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
