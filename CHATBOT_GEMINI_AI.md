# 🤖 CHATBOT GEMINI AI - LAG VINTAGE SHOP

## 📋 Tổng Quan

Chatbot thông minh được tích hợp với **Google Gemini AI** để hỗ trợ khách hàng 24/7.

---

## ✨ Tính Năng

### 1. **Trò Chuyện Thông Minh**
- Sử dụng Google Gemini Pro AI
- Hiểu ngữ cảnh và lịch sử cuộc trò chuyện
- Trả lời tự nhiên, thân thiện

### 2. **Tư Vấn Sản Phẩm**
- Gợi ý sản phẩm phù hợp
- Thông tin về thời trang vintage
- Tư vấn công nghệ cũ

### 3. **Hỗ Trợ Mua Hàng**
- Hướng dẫn đặt hàng
- Giải đáp về thanh toán
- Theo dõi đơn hàng
- Chính sách đổi trả

### 4. **Gợi Ý Thông Minh**
- Câu hỏi mẫu để bắt đầu
- Quick reply buttons
- Suggestions dựa trên context

---

## 🚀 Cách Sử Dụng

### **Cho Khách Hàng:**

1. **Mở Chatbot:**
   - Click vào icon chatbot ở góc dưới bên phải
   - Chatbot sẽ chào hỏi và hiển thị gợi ý câu hỏi

2. **Bắt Đầu Trò Chuyện:**
   - Nhập câu hỏi vào ô input
   - Hoặc click vào câu hỏi gợi ý
   - Nhấn Enter hoặc nút gửi 📤

3. **Các Câu Hỏi Mẫu:**
   - "Tôi muốn tìm áo khoác vintage 🧥"
   - "Shop có laptop cũ không? 💻"
   - "Giá sản phẩm như thế nào? 💰"
   - "Làm sao để đặt hàng? 🛒"
   - "Sản phẩm có bảo hành không? ✅"

4. **Typing Indicator:**
   - Hiển thị 3 chấm nhảy khi bot đang suy nghĩ
   - Đợi vài giây để nhận câu trả lời

---

## 🔧 Cài Đặt & Cấu Hình

### **1. Cài Đặt Package**
```bash
cd backend
npm install @google/generative-ai
```

### **2. Cấu Hình API Key**
Thêm vào file `backend/.env`:
```env
GEMINI_API_KEY=AIzaSyAGJPKsCAmTM3ybFzaofywao1rK9yRIbgg
```

### **3. File Cấu Trúc**
```
backend/
├── routes/
│   └── chatbot.js          # API routes cho chatbot
└── .env                     # Environment variables

frontend/
├── components/
│   ├── chatbot.html        # Giao diện chatbot
│   ├── chatbot.js          # Logic chatbot + Gemini AI
│   └── loader.js           # Load components
└── style.css               # CSS cho chatbot (typing, suggestions)
```

---

## 📡 API Endpoints

### **POST /api/chatbot/chat**
Gửi tin nhắn và nhận phản hồi từ AI

**Request:**
```json
{
  "message": "Tôi muốn mua áo khoác vintage",
  "sessionId": "session_123456789_abc"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Chào bạn! LAG Vintage Shop có nhiều mẫu áo khoác vintage đẹp...",
    "timestamp": "2025-10-02T10:30:00.000Z"
  }
}
```

### **GET /api/chatbot/suggestions**
Lấy danh sách gợi ý câu hỏi

**Response:**
```json
{
  "success": true,
  "data": [
    "Tôi muốn tìm áo khoác vintage 🧥",
    "Shop có laptop cũ không? 💻",
    "Giá sản phẩm như thế nào? 💰"
  ]
}
```

### **DELETE /api/chatbot/history/:sessionId**
Xóa lịch sử chat của session

---

## 🎨 Giao Diện

### **Components:**
- ✅ **Toggle Button** - Icon chatbot gradient với animation
- ✅ **Chat Window** - Popup 400x500px với shadow
- ✅ **Header** - Avatar bot + status online
- ✅ **Messages** - User message (right) + Bot message (left)
- ✅ **Typing Indicator** - 3 dots animation
- ✅ **Suggestions** - Quick reply buttons
- ✅ **Input Field** - Rounded input + send button

### **Animations:**
- `slideUp` - Chat window xuất hiện từ dưới lên
- `fadeIn` - Messages fade in
- `typing` - Dots nhảy lên xuống
- `hover` - Scale & gradient effects

---

## 🧠 AI Prompt System

### **System Prompt:**
Bot được training với thông tin:
- Tên shop: LAG Vintage Shop
- Sản phẩm: Thời trang vintage + Công nghệ cũ
- Chính sách: Giao hàng toàn quốc, COD, Bảo hành
- Tính cách: Thân thiện, nhiệt tình, chuyên nghiệp

### **Context Management:**
- Lưu 20 tin nhắn gần nhất
- Sử dụng 6 tin nhắn cuối làm context
- Tự động xóa sau 30 phút không hoạt động

---

## 🔒 Bảo Mật

1. **Session ID** - Mỗi user có sessionId riêng
2. **XSS Protection** - Escape HTML trong user input
3. **Rate Limiting** - Có thể thêm rate limit cho API
4. **API Key** - Lưu trong .env, không commit lên git

---

## 📊 Logs & Debug

### **Console Logs:**
```javascript
console.log('Chatbot component loaded');
console.error('Chatbot error:', error);
```

### **Network Tab:**
- Kiểm tra request `/api/chatbot/chat`
- Response time: 2-5 giây
- Status: 200 OK

---

## 🐛 Troubleshooting

### **1. Chatbot không hiển thị:**
```javascript
// Kiểm tra trong Console:
document.querySelector('.chatbot-widget')  // Phải có element
```

### **2. Không gửi được tin nhắn:**
```javascript
// Kiểm tra:
- Server đã chạy? http://localhost:3000
- API key đúng chưa? Check .env
- Network tab có lỗi không?
```

### **3. Bot không trả lời:**
```bash
# Check server logs:
cd backend
node server.js
# Xem log lỗi ở terminal
```

### **4. Lỗi "Cannot find module":**
```bash
cd backend
npm install @google/generative-ai
```

---

## 📈 Future Improvements

- [ ] Voice input/output
- [ ] Image recognition (nhận diện sản phẩm qua ảnh)
- [ ] Rich messages (carousel, buttons)
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Integration với Facebook Messenger
- [ ] Save chat history to database
- [ ] Admin panel để training bot

---

## 📞 Support

**Developer:** LAG Vintage Shop Team  
**Email:** support@lagvintageshop.com  
**Gemini AI Docs:** https://ai.google.dev/gemini-api/docs

---

## ✅ Checklist Hoàn Thành

- [x] Cài đặt Google Gemini AI SDK
- [x] Tạo API routes cho chatbot
- [x] Cấu hình API key trong .env
- [x] Thiết kế giao diện chatbot
- [x] Tích hợp Gemini AI vào chatbot.js
- [x] Thêm typing indicator animation
- [x] Tạo suggestions system
- [x] Test chat flow
- [x] Format bot messages (markdown support)
- [x] Session management
- [x] Auto-clear history after 30min
- [x] Responsive design
- [x] Error handling
- [x] Documentation

---

**🎉 Chatbot đã sẵn sàng sử dụng!**

Truy cập: http://localhost:3000 và click vào icon chatbot để test!
