// =============================================
// ORDERS ROUTES - LAG VINTAGE SHOP
// =============================================

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { requireAuth } = require('../middleware/auth');

// =============================================
// Tạo đơn hàng mới (từ giỏ hàng)
// =============================================
router.post('/create', requireAuth, async (req, res) => {
    try {
        const { userId, orderData } = req.body;
        
        if (!orderData) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin đơn hàng'
            });
        }
        
        // Tạo đơn hàng
        const orderResult = await Order.createOrder(userId, orderData);
        
        if (!orderResult.success) {
            return res.status(400).json(orderResult);
        }
        
        // Tạo payment record
        await Payment.createPayment(orderResult.order.order_id, {
            payment_method: orderData.payment_method || 'bank',
            amount: orderData.total_amount,
            payment_status: 'pending'
        });
        
        // Tạo QR code
        const qrInfo = Payment.generateQRCode(
            orderResult.order.order_code,
            orderData.total_amount,
            `Thanh toan don hang ${orderResult.order.order_code}`
        );
        
        res.json({
            success: true,
            message: 'Đơn hàng đã được tạo thành công',
            order: orderResult.order,
            qr: qrInfo
        });
        
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// =============================================
// Lấy danh sách đơn hàng của user
// =============================================
router.get('/my-orders', requireAuth, async (req, res) => {
    try {
        const { userId } = req.query;
        
        const result = await Order.getOrdersByUser(userId);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// =============================================
// Lấy chi tiết đơn hàng
// =============================================
router.get('/:orderId', requireAuth, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.query;
        
        const result = await Order.getOrderDetail(orderId, userId);
        
        if (result.success) {
            // Lấy thêm thông tin payment & QR
            const paymentResult = await Payment.getPaymentByOrder(orderId);
            
            res.json({
                ...result,
                payment: paymentResult.success ? paymentResult.payment : null,
                qr: paymentResult.success ? paymentResult.qr : null
            });
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Get order detail error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// =============================================
// Hủy đơn hàng
// =============================================
router.post('/:orderId/cancel', requireAuth, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.body;
        
        const result = await Order.cancelOrder(orderId, userId);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// =============================================
// Cập nhật trạng thái đơn hàng (Admin)
// =============================================
router.put('/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu trạng thái'
            });
        }
        
        const result = await Order.updateOrderStatus(orderId, status);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
