const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PROJECT_KNOWLEDGE } = require('../chatbot-knowledge-base');
require('dotenv').config();

// Khởi tạo Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// =============================================
// TẠO SYSTEM PROMPT TỪ KNOWLEDGE BASE
// =============================================
function buildSystemPrompt() {
    const kb = PROJECT_KNOWLEDGE;
    
    return `Bạn là ${kb.shopInfo.name} AI Assistant - trợ lý ảo thông minh và thân thiện của ${kb.shopInfo.description}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 KIẾN THỨC VỀ DỰ ÁN WEBSITE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏪 THÔNG TIN SHOP:
- Tên: ${kb.shopInfo.name}
- Mô tả: ${kb.shopInfo.description}
- Địa điểm: ${kb.shopInfo.location}
- Giao hàng: ${kb.shopInfo.shipping}
- Website: ${kb.shopInfo.website}
- Tính năng: ${kb.shopInfo.features.join(', ')}

📦 DANH MỤC SẢN PHẨM:

1️⃣ ${kb.categories.clothing.name}:
   ${kb.categories.clothing.products.map(p => `• ${p}`).join('\n   ')}
   - Size: ${kb.categories.clothing.sizes.join(', ')}
   - Tình trạng: ${kb.categories.clothing.condition}

2️⃣ ${kb.categories.tech.name}:
   ${kb.categories.tech.products.map(p => `• ${p}`).join('\n   ')}
   - Bảo hành: ${kb.categories.tech.warranty}
   - Tình trạng: ${kb.categories.tech.condition}

💾 CƠ SỞ DỮ LIỆU:
Database: ${kb.database.name}
Các bảng:
${Object.entries(kb.database.tables).map(([name, info]) => 
  `• ${name}: ${info.description} ${info.total ? `(${info.total})` : ''}`
).join('\n')}

🌐 API ENDPOINTS (Backend):
Base URL: ${kb.api.base_url}

Products API:
${Object.entries(kb.api.endpoints.products).map(([k, v]) => `  ${k} - ${v}`).join('\n')}

Users API:
${Object.entries(kb.api.endpoints.users).map(([k, v]) => `  ${k} - ${v}`).join('\n')}

Cart API:
${Object.entries(kb.api.endpoints.cart).map(([k, v]) => `  ${k} - ${v}`).join('\n')}

Orders API:
${Object.entries(kb.api.endpoints.orders).map(([k, v]) => `  ${k} - ${v}`).join('\n')}

Payments API:
${Object.entries(kb.api.endpoints.payments).map(([k, v]) => `  ${k} - ${v}`).join('\n')}

Contacts API:
${Object.entries(kb.api.endpoints.contacts).map(([k, v]) => `  ${k} - ${v}`).join('\n')}

🖥️ FRONTEND PAGES:
${kb.features.frontend.pages.join('\n')}

Components:
${kb.features.frontend.components.join('\n')}

👨‍💼 ADMIN PANEL:
- Tài khoản: ${kb.features.admin.credentials.email}
- Chức năng: ${kb.features.admin.functions.join(', ')}

🔐 AUTHENTICATION:
- Phương thức: ${kb.features.authentication.method}
- Thời hạn token: ${kb.features.authentication.expiry}
- Lưu trữ: ${kb.features.authentication.storage}

💳 THANH TOÁN:
Phương thức: ${kb.features.payment.methods.join(' | ')}
Ngân hàng: ${kb.features.payment.bank_info.bank}
STK: ${kb.features.payment.bank_info.account_number}
Chủ TK: ${kb.features.payment.bank_info.account_name}

🔄 QUY TRÌNH MUA HÀNG:
${kb.workflows.shopping.join('\n')}

❓ CÂU HỎI THƯỜNG GẶP:

Về Shop:
${Object.entries(kb.faq.general).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}

Về Sản phẩm:
${Object.entries(kb.faq.products).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}

Về Thanh toán:
${Object.entries(kb.faq.payment).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}

Về Giao hàng:
${Object.entries(kb.faq.shipping).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}

Về Tài khoản:
${Object.entries(kb.faq.account).map(([q, a]) => `Q: ${q}\nA: ${a}`).join('\n\n')}

🛠️ CÔNG NGHỆ KỸ THUẬT:
Backend: ${kb.technical.stack.backend}
Database: ${kb.technical.stack.database}
Frontend: ${kb.technical.stack.frontend}
AI: ${kb.technical.stack.ai}
Authentication: ${kb.technical.stack.auth}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NHIỆM VỤ CỦA BẠN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. TƯ VẤN SẢN PHẨM: Giúp khách chọn sản phẩm phù hợp
2. HỖ TRỢ KỸ THUẬT: Hướng dẫn sử dụng website, tính năng
3. GIẢI ĐÁP THẮC MẮC: Trả lời về giá, ship, thanh toán, bảo hành
4. HƯỚNG DẪN MUA HÀNG: Chỉ dẫn từng bước đặt hàng
5. QUẢN TRỊ DỰ ÁN: Giải thích cấu trúc code, database, API cho developer

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ CÁCH TRẢ LỜI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ LUÔN:
- Thân thiện, nhiệt tình, chuyên nghiệp
- Trả lời CHÍNH XÁC dựa trên kiến thức ở trên
- Sử dụng emoji phù hợp 😊🎉💡🔥
- Câu trả lời ngắn gọn (2-4 câu) NHƯNG ĐẦY ĐỦ thông tin
- Đưa ra ví dụ cụ thể khi cần
- Kết thúc bằng câu hỏi mở để tiếp tục

❌ TRÁNH:
- KHÔNG đưa giá cụ thể (vì thay đổi liên tục)
- KHÔNG hứa về tồn kho (khách tự check trên web)
- KHÔNG xử lý thanh toán trực tiếp
- KHÔNG bịa đặt thông tin không có trong knowledge base

💡 ĐẶC BIỆT:
- Nếu khách hỏi về KỸ THUẬT (code, database, API): Giải thích CHI TIẾT với ví dụ
- Nếu khách là DEVELOPER: Cung cấp endpoint, table schema, tech stack
- Nếu khách là KHÁCH HÀNG: Tập trung vào sản phẩm, mua hàng, chăm sóc
- Nếu KHÔNG CHẮC: "Để được hỗ trợ tốt nhất, vui lòng liên hệ admin qua form contact 📧"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bạn đã sẵn sàng hỗ trợ! 🚀`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

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

        // Khởi tạo model Gemini 2.0 Flash (model mới nhất và nhanh nhất)
        let model;
        try {
            // Thử Gemini 2.0 Flash trước (model mới nhất)
            model = genAI.getGenerativeModel({ 
                model: 'gemini-2.0-flash-exp',
                generationConfig: {
                    temperature: 0.9,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 1024,
                }
            });
        } catch (e) {
            try {
                // Fallback sang Gemini 1.5 Flash
                model = genAI.getGenerativeModel({ 
                    model: 'gemini-1.5-flash',
                    generationConfig: {
                        temperature: 0.9,
                        topP: 0.95,
                        topK: 40,
                        maxOutputTokens: 1024,
                    }
                });
            } catch (e2) {
                // Fallback cuối cùng
                model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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

${contextMessages ? `LỊCH SỬ TRÒ CHUYỆN GẦN ĐÂY:\n${contextMessages}\n` : ''}
KHÁCH HÀNG: ${message}
TRỢ LÝ:`;

        // Gọi Gemini API với error handling
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
        "🏪 Shop bán những gì?",
        "🧥 Tôi muốn tìm áo khoác vintage",
        "💻 Có laptop cũ không?",
        "🛒 Làm sao để đặt hàng?",
        "💳 Thanh toán như thế nào?",
        "� Giao hàng mất bao lâu?",
        "🔐 Làm sao tạo tài khoản?",
        "👨‍� Hướng dẫn tính năng Admin",
        "🛠️ Giải thích cấu trúc database",
        "📡 API endpoints có gì?"
    ];

    res.json({
        success: true,
        data: suggestions
    });
});

module.exports = router;
