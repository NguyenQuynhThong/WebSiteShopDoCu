// =============================================
// AUTHENTICATION MIDDLEWARE
// =============================================

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';

// Verify JWT Token
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token xác thực',
                requireLogin: true
            });
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                    requireLogin: true
                });
            }

            req.user = decoded; // { userId, email, role }
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực',
            error: error.message
        });
    }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Vui lòng đăng nhập'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập. Chỉ admin mới được phép.'
        });
    }

    next();
};

// Kiểm tra user đã đăng nhập (có userId)
const requireAuth = (req, res, next) => {
    const userId = req.body.userId || req.query.userId;
    
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Vui lòng đăng nhập để thực hiện thao tác này',
            requireLogin: true
        });
    }
    
    // Attach userId to request
    req.userId = userId;
    next();
};

// Kiểm tra user hoặc session (cho phép guest)
const requireAuthOrSession = (req, res, next) => {
    const userId = req.body.userId || req.query.userId;
    const sessionId = req.body.sessionId || req.query.sessionId;
    
    if (!userId && !sessionId) {
        return res.status(401).json({
            success: false,
            message: 'Thiếu thông tin xác thực',
            requireLogin: false
        });
    }
    
    req.userId = userId;
    req.sessionId = sessionId;
    next();
};

module.exports = {
    verifyToken,
    isAdmin,
    requireAuth,
    requireAuthOrSession
};
