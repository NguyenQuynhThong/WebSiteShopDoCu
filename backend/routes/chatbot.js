const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt cho chatbot về shop thời trang vintage
const SYSTEM_PROMPT = `Bạn là trợ lý ảo thân thiện của LAG Vintage Shop - cửa hàng chuyên bán đồ thời trang vintage và công nghệ cũ chất lượng cao.

THÔNG TIN VỀ SHOP:
- Tên shop: LAG Vintage Shop
- Chuyên: Thời trang vintage (áo khoác, áo sơ mi, quần, váy) và công nghệ cũ (điện thoại, laptop, tai nghe, phụ kiện)
- Đặc điểm: Sản phẩm second-hand chất lượng cao, được kiểm định kỹ càng
- Website: Hỗ trợ đặt hàng online, thanh toán COD và chuyển khoản
- Địa chỉ: Việt Nam (có giao hàng toàn quốc)

NHIỆM VỤ CỦA BẠN:
1. Tư vấn sản phẩm thời trang vintage và công nghệ
2. Hỗ trợ tìm kiếm sản phẩm phù hợp với nhu cầu khách hàng
3. Giải đáp thắc mắc về giá cả, chất lượng, giao hàng
4. Hướng dẫn mua hàng, thanh toán, theo dõi đơn hàng
5. Giới thiệu các chương trình khuyến mãi (nếu có)

CÁCH TRẢ LỜI:
- Thân thiện, nhiệt tình, chuyên nghiệp
- Ngắn gọn, dễ hiểu (2-3 câu mỗi câu trả lời)
- Sử dụng emoji phù hợp để tạo không khí thân thiện
- Nếu không chắc chắn, hãy đề xuất khách hàng liên hệ hotline hoặc xem trực tiếp trên website
- Luôn kết thúc bằng câu hỏi mở để tiếp tục cuộc trò chuyện

LƯU Ý:
- KHÔNG đưa ra thông tin giá cụ thể (vì giá thay đổi thường xuyên)
- KHÔNG hứa hẹn về tình trạng kho (đề xuất khách kiểm tra trên website)
- KHÔNG xử lý thanh toán hay đặt hàng trực tiếp (hướng dẫn qua website)`;

// Lưu trữ lịch sử chat (trong production nên dùng database hoặc Redis)
const chatHistory = new Map();

// API endpoint để chat
router.post('/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tin nhắn'
            });
        }

        // Khởi tạo model
        // Thử các model khác nhau nếu một model không hoạt động
        let model;
        try {
            model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        } catch (e) {
            try {
                model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            } catch (e2) {
                model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
            }
        }

        // Lấy lịch sử chat từ session (nếu có)
        const userId = sessionId || 'anonymous';
        let history = chatHistory.get(userId) || [];

        // Tạo context từ lịch sử
        let contextMessages = history.length > 0 
            ? history.slice(-6).map(h => `${h.role}: ${h.message}`).join('\n')
            : '';

        // Tạo prompt đầy đủ
        const fullPrompt = `${SYSTEM_PROMPT}

${contextMessages ? `LỊCH SỬ TRÒ CHUYỆN GÇN ĐÂY:\n${contextMessages}\n` : ''}
KHÁCH HÀNG: ${message}
TRỢ LÝ:`;

        // Gọi Gemini API
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const botReply = response.text();

        // Lưu lịch sử
        history.push({ role: 'user', message, timestamp: new Date() });
        history.push({ role: 'bot', message: botReply, timestamp: new Date() });

        // Giới hạn lịch sử tối đa 20 tin nhắn
        if (history.length > 20) {
            history = history.slice(-20);
        }
        chatHistory.set(userId, history);

        // Tự động xóa lịch sử sau 30 phút không hoạt động
        setTimeout(() => {
            const currentHistory = chatHistory.get(userId);
            if (currentHistory && currentHistory.length > 0) {
                const lastMessage = currentHistory[currentHistory.length - 1];
                const timeDiff = Date.now() - new Date(lastMessage.timestamp).getTime();
                if (timeDiff > 30 * 60 * 1000) { // 30 phút
                    chatHistory.delete(userId);
                }
            }
        }, 30 * 60 * 1000);

        res.json({
            success: true,
            data: {
                message: botReply,
                timestamp: new Date()
            }
        });

    } catch (error) {
        console.error('Chatbot Error:', error);
        res.status(500).json({
            success: false,
            message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
            error: error.message
        });
    }
});

// API để xóa lịch sử chat
router.delete('/history/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    chatHistory.delete(sessionId);
    
    res.json({
        success: true,
        message: 'Đã xóa lịch sử chat'
    });
});

// API để lấy gợi ý câu hỏi
router.get('/suggestions', (req, res) => {
    const suggestions = [
        "Tôi muốn tìm áo khoác vintage 🧥",
        "Shop có laptop cũ không? 💻",
        "Giá sản phẩm như thế nào? 💰",
        "Làm sao để đặt hàng? 🛒",
        "Sản phẩm có bảo hành không? ✅"
    ];

    res.json({
        success: true,
        data: suggestions
    });
});

module.exports = router;
