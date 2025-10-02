// =============================================
// PAYMENTS ROUTES - LAG VINTAGE SHOP
// =============================================

const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { requireAuth } = require('../middleware/auth');

// =============================================
// Lấy QR code cho đơn hàng
// =============================================
router.get('/qr/:orderId', requireAuth, async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const result = await Payment.getPaymentByOrder(orderId);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Get QR error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// =============================================
// Kiểm tra trạng thái thanh toán
// =============================================
router.get('/status/:orderId', requireAuth, async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const result = await Payment.checkPaymentStatus(orderId);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Check payment status error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// =============================================
// Xác nhận thanh toán (Manual/Admin)
// =============================================
router.post('/confirm/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { transaction_id } = req.body;
        
        const result = await Payment.confirmPayment(orderId, transaction_id);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

// =============================================
// Webhook từ ngân hàng (Future)
// =============================================
router.post('/webhook', async (req, res) => {
    try {
        // TODO: Xử lý webhook từ ngân hàng
        // Verify signature, update payment status
        
        const { order_id, transaction_id, amount, status } = req.body;
        
        if (status === 'success') {
            await Payment.updatePaymentStatus(order_id, 'paid', transaction_id);
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server'
        });
    }
});

module.exports = router;
