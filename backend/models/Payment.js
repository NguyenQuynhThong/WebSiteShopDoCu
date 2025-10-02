// =============================================
// PAYMENT MODEL - LAG VINTAGE SHOP
// Tạo QR Code VietQR cho thanh toán
// =============================================

const { pool: db } = require('../config/database');

class Payment {
    // =============================================
    // Thông tin tài khoản ngân hàng (Cấu hình)
    // =============================================
    static BANK_INFO = {
        bankCode: 'VCB',                    // Vietcombank
        accountNumber: '0335060370',        // Số tài khoản (từ hình QR bạn gửi)
        accountName: 'NGUYEN QUYNH THONG', // Tên tài khoản
        template: 'compact'                 // Template QR
    };
    
    // =============================================
    // Tạo QR Code cho đơn hàng
    // =============================================
    static generateQRCode(orderCode, amount, description = '') {
        // VietQR API format
        // https://img.vietqr.io/image/{BANK_ID}-{ACCOUNT_NO}-{TEMPLATE}.png?amount={AMOUNT}&addInfo={INFO}&accountName={NAME}
        
        const bankId = this.BANK_INFO.bankCode;
        const accountNo = this.BANK_INFO.accountNumber;
        const accountName = encodeURIComponent(this.BANK_INFO.accountName);
        const template = this.BANK_INFO.template;
        
        // Đảm bảo amount là số nguyên (VietQR không chấp nhận số thập phân)
        const amountInt = Math.round(parseFloat(amount));
        
        // Nội dung chuyển khoản
        const addInfo = encodeURIComponent(description || `Thanh toan ${orderCode}`);
        
        // URL QR Code
        const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amountInt}&addInfo=${addInfo}&accountName=${accountName}`;
        
        return {
            qr_url: qrUrl,
            qrUrl: qrUrl, // Thêm alias cho frontend
            bank_code: bankId,
            account_number: accountNo,
            account_name: this.BANK_INFO.accountName,
            amount: amountInt,
            content: description || `Thanh toan ${orderCode}`
        };
    }
    
    // =============================================
    // Tạo payment record
    // =============================================
    static async createPayment(orderId, paymentData) {
        try {
            const [result] = await db.query(`
                INSERT INTO payments (
                    order_id, payment_method, amount,
                    transaction_id, payment_status, payment_date, created_at
                ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            `, [
                orderId,
                paymentData.payment_method || 'bank',
                paymentData.amount,
                paymentData.transaction_id || null,
                paymentData.payment_status || 'pending'
            ]);
            
            return {
                success: true,
                payment_id: result.insertId
            };
        } catch (error) {
            console.error('Create payment error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // =============================================
    // Lấy thông tin thanh toán của đơn hàng
    // =============================================
    static async getPaymentByOrder(orderId) {
        try {
            const [payments] = await db.query(`
                SELECT p.*, o.order_code, o.total_amount
                FROM payments p
                JOIN orders o ON p.order_id = o.order_id
                WHERE p.order_id = ?
                ORDER BY p.created_at DESC
                LIMIT 1
            `, [orderId]);
            
            if (payments.length === 0) {
                return {
                    success: false,
                    message: 'Không tìm thấy thông tin thanh toán'
                };
            }
            
            // Tạo QR code
            const qrInfo = this.generateQRCode(
                payments[0].order_code,
                payments[0].total_amount,
                `Thanh toan don hang ${payments[0].order_code}`
            );
            
            return {
                success: true,
                payment: payments[0],
                qr: qrInfo
            };
        } catch (error) {
            console.error('Get payment error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // =============================================
    // Cập nhật trạng thái thanh toán
    // =============================================
    static async updatePaymentStatus(orderId, status, transactionId = null) {
        try {
            await db.query(`
                UPDATE payments 
                SET payment_status = ?, 
                    transaction_id = COALESCE(?, transaction_id),
                    payment_date = IF(? = 'paid', NOW(), payment_date),
                    updated_at = NOW()
                WHERE order_id = ?
            `, [status, transactionId, status, orderId]);
            
            // Nếu thanh toán thành công, cập nhật order status
            if (status === 'paid') {
                await db.query(`
                    UPDATE orders 
                    SET order_status = 'processing', updated_at = NOW()
                    WHERE order_id = ?
                `, [orderId]);
            }
            
            return {
                success: true,
                message: 'Đã cập nhật trạng thái thanh toán'
            };
        } catch (error) {
            console.error('Update payment status error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
    
    // =============================================
    // Xác nhận thanh toán (Manual - Admin)
    // =============================================
    static async confirmPayment(orderId, transactionId) {
        const connection = await db.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Update payment
            await connection.query(`
                UPDATE payments 
                SET payment_status = 'paid',
                    transaction_id = ?,
                    payment_date = NOW(),
                    updated_at = NOW()
                WHERE order_id = ?
            `, [transactionId, orderId]);
            
            // Update order
            await connection.query(`
                UPDATE orders 
                SET order_status = 'processing', updated_at = NOW()
                WHERE order_id = ?
            `, [orderId]);
            
            await connection.commit();
            
            return {
                success: true,
                message: 'Đã xác nhận thanh toán'
            };
        } catch (error) {
            await connection.rollback();
            console.error('Confirm payment error:', error);
            return {
                success: false,
                message: error.message
            };
        } finally {
            connection.release();
        }
    }
    
    // =============================================
    // Kiểm tra trạng thái thanh toán
    // (Tích hợp webhook hoặc check manual)
    // =============================================
    static async checkPaymentStatus(orderId) {
        try {
            const [payments] = await db.query(`
                SELECT * FROM payments WHERE order_id = ?
            `, [orderId]);
            
            if (payments.length === 0) {
                return {
                    success: false,
                    message: 'Không tìm thấy thông tin thanh toán'
                };
            }
            
            return {
                success: true,
                payment_status: payments[0].payment_status,
                transaction_id: payments[0].transaction_id
            };
        } catch (error) {
            console.error('Check payment status error:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = Payment;
