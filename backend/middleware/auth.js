// =============================================
// AUTHENTICATION MIDDLEWARE
// =============================================

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
    requireAuth,
    requireAuthOrSession
};
