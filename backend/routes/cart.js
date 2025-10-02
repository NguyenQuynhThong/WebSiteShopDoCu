const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { requireAuth, requireAuthOrSession } = require('../middleware/auth');

// Lấy giỏ hàng - Yêu cầu đăng nhập
router.get('/', requireAuth, async (req, res) => {
    try {
        const { userId } = req.query;
        
        const result = await Cart.getCart(userId, null);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Thêm vào giỏ hàng - Yêu cầu đăng nhập
router.post('/add', requireAuth, async (req, res) => {
    try {
        const { productId, quantity, userId } = req.body;
        
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin sản phẩm'
            });
        }
        
        // Chỉ sử dụng userId, không dùng sessionId
        const result = await Cart.addToCart(productId, quantity || 1, userId, null);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Cập nhật số lượng - Yêu cầu đăng nhập
router.put('/update/:cartId', requireAuth, async (req, res) => {
    try {
        const { cartId } = req.params;
        const { quantity, userId } = req.body;
        
        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Số lượng không hợp lệ'
            });
        }
        
        const result = await Cart.updateQuantity(cartId, quantity, userId, null);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Xóa sản phẩm - Yêu cầu đăng nhập
router.delete('/remove/:cartId', requireAuth, async (req, res) => {
    try {
        const { cartId } = req.params;
        const { userId } = req.query;
        
        const result = await Cart.removeFromCart(cartId, userId, null);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Xóa toàn bộ giỏ hàng - Yêu cầu đăng nhập
router.delete('/clear', requireAuth, async (req, res) => {
    try {
        const { userId } = req.query;
        
        const result = await Cart.clearCart(userId, null);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// Hợp nhất giỏ hàng (khi đăng nhập)
router.post('/merge', async (req, res) => {
    try {
        const { sessionId, userId } = req.body;
        
        if (!sessionId || !userId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin'
            });
        }
        
        const result = await Cart.mergeCart(sessionId, userId);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Merge cart error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
