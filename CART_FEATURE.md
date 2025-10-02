# 🛒 CHỨC NĂNG GIỎ HÀNG - LAG VINTAGE SHOP

## ✅ ĐÃ HOÀN THÀNH

### 1. Database Schema
- **Bảng `cart`** đã tồn tại với cấu trúc đầy đủ:
  ```sql
  - cart_id (PK, AUTO_INCREMENT)
  - user_id (FK → users, NULL cho guest)
  - session_id (VARCHAR(255), NULL cho user đăng nhập)
  - product_id (FK → products)
  - quantity (INT, > 0)
  - added_at (TIMESTAMP)
  - updated_at (TIMESTAMP, auto update)
  ```
- **Indexes**: user_id, session_id, product_id
- **Constraints**: 
  - Quantity > 0
  - Phải có user_id HOẶC session_id (không cả 2)
- **Hiện tại**: 7 items trong giỏ hàng

### 2. Backend API

#### **Model: `backend/models/Cart.js`**
Các phương thức:
- `getCart(userId, sessionId)` - Lấy giỏ hàng
- `addToCart(productId, quantity, userId, sessionId)` - Thêm sản phẩm
- `updateQuantity(cartId, quantity, userId, sessionId)` - Cập nhật số lượng
- `removeFromCart(cartId, userId, sessionId)` - Xóa sản phẩm
- `clearCart(userId, sessionId)` - Xóa toàn bộ giỏ hàng
- `mergeCart(sessionId, userId)` - Hợp nhất giỏ hàng khi đăng nhập

**Logic xử lý:**
- ✅ Kiểm tra sản phẩm tồn tại
- ✅ Kiểm tra số lượng trong kho (stock_quantity)
- ✅ Tự động cập nhật nếu sản phẩm đã có trong giỏ
- ✅ Tính subtotal cho mỗi item
- ✅ Tính tổng số lượng và tổng tiền
- ✅ Xử lý hình ảnh (http, /images, hoặc tên file)

#### **Routes: `backend/routes/cart.js`**
API Endpoints:
```
GET    /api/cart                     - Lấy giỏ hàng
POST   /api/cart/add                 - Thêm vào giỏ
PUT    /api/cart/update/:cartId      - Cập nhật số lượng
DELETE /api/cart/remove/:cartId      - Xóa sản phẩm
DELETE /api/cart/clear                - Xóa toàn bộ
POST   /api/cart/merge               - Hợp nhất giỏ hàng
```

**Request/Response Format:**
```javascript
// GET /api/cart?userId=1&sessionId=xxx
Response: {
    success: true,
    cart: [
        {
            cart_id: 21,
            product_id: 53,
            quantity: 2,
            name: "Áo Bomber Vintage",
            price: "250000",
            image: "/images/aobomber.jpg",
            stock: 15,
            subtotal: "500000",
            added_at: "2025-10-02..."
        }
    ],
    summary: {
        totalItems: 3,
        total: "1250000.00"
    }
}

// POST /api/cart/add
Body: {
    productId: 53,
    quantity: 1,
    userId: 1,        // NULL nếu guest
    sessionId: null   // NULL nếu đã login
}
```

### 3. Frontend

#### **File: `frontend/cart.js`**
Chức năng đầy đủ:
- ✅ Load giỏ hàng khi vào trang
- ✅ Hiển thị danh sách sản phẩm với hình ảnh
- ✅ Tăng/giảm số lượng với validation
- ✅ Xóa sản phẩm khỏi giỏ
- ✅ Xóa toàn bộ giỏ hàng
- ✅ Tính tổng tiền tự động
- ✅ Hiển thị phí vận chuyển
- ✅ Update cart count trong header
- ✅ Xử lý guest user với sessionId
- ✅ Loading states
- ✅ Error handling
- ✅ Notifications

**Session Management:**
```javascript
// Guest user
sessionId = localStorage.getItem('sessionId') || generateSessionId()

// Logged in user  
userId = localStorage.getItem('userId')

// Khi đăng nhập → merge cart
await fetch('/api/cart/merge', {
    body: JSON.stringify({ sessionId, userId })
})
```

#### **File: `frontend/cart.html`**
- ✅ Load components (header, nav, footer)
- ✅ Load script cart.js
- ✅ Responsive layout
- ✅ Summary panel

### 4. Logic Flow

#### **Thêm sản phẩm vào giỏ (từ products.html)**
```javascript
// products.js
async function addToCart(productId) {
    const userId = localStorage.getItem('userId');
    const sessionId = localStorage.getItem('sessionId') || generateSessionId();
    
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productId,
            quantity: 1,
            userId,
            sessionId
        })
    });
    
    // Update cart count
    updateCartCount();
}
```

#### **Xem giỏ hàng (cart.html)**
```
1. Load cart.html
2. cart.js → loadCart()
3. Fetch GET /api/cart?userId=...&sessionId=...
4. Backend → Cart.getCart()
5. Query database với JOIN products
6. Return cart items + summary
7. Frontend → displayCart()
8. Render HTML dynamically
```

#### **Cập nhật số lượng**
```
1. User click +/- hoặc nhập số
2. updateQuantity(cartId, newQuantity)
3. Fetch PUT /api/cart/update/:cartId
4. Backend → check stock
5. Update database
6. Frontend → reload cart
```

#### **Khi đăng nhập**
```
1. User login thành công
2. Get sessionId from localStorage
3. Fetch POST /api/cart/merge
4. Backend → mergeCart(sessionId, userId)
   - Lấy session cart
   - Lấy user cart
   - Merge: cộng quantity hoặc move items
   - Xóa session cart
5. localStorage.removeItem('sessionId')
6. Cart now belongs to user
```

## 🎯 TÍNH NĂNG

### Đã Có
- [x] Thêm sản phẩm vào giỏ
- [x] Xem giỏ hàng
- [x] Tăng/giảm số lượng
- [x] Xóa sản phẩm
- [x] Xóa toàn bộ giỏ
- [x] Tính tổng tiền tự động
- [x] Hỗ trợ guest user (sessionId)
- [x] Hỗ trợ logged in user (userId)
- [x] Merge cart khi đăng nhập
- [x] Kiểm tra stock quantity
- [x] Update cart count real-time
- [x] Responsive design
- [x] Loading states
- [x] Error handling
- [x] Notifications

### Có Thể Mở Rộng
- [ ] Mã giảm giá (voucher/coupon)
- [ ] Tính phí ship theo địa chỉ
- [ ] Lưu cart vào database cho guest (tự động sau 30 ngày)
- [ ] Wishlist (danh sách yêu thích)
- [ ] Gợi ý sản phẩm liên quan
- [ ] Cart history
- [ ] Share cart với người khác

## 🚀 CÁCH SỬ DỤNG

### Khởi động Backend
```powershell
cd D:\DuANShopQuanAoCu\backend
node server.js
```

### Mở Frontend
```powershell
# Mở bằng Live Server hoặc
start D:\DuANShopQuanAoCu\frontend\cart.html
```

### Test API với cURL
```powershell
# Lấy giỏ hàng
curl http://localhost:3000/api/cart?userId=1

# Thêm sản phẩm
curl -X POST http://localhost:3000/api/cart/add `
  -H "Content-Type: application/json" `
  -d '{\"productId\": 53, \"quantity\": 2, \"userId\": 1}'

# Cập nhật số lượng
curl -X PUT http://localhost:3000/api/cart/update/21 `
  -H "Content-Type: application/json" `
  -d '{\"quantity\": 3, \"userId\": 1}'

# Xóa sản phẩm
curl -X DELETE "http://localhost:3000/api/cart/remove/21?userId=1"
```

## 📝 GHI CHÚ

- Server: `http://localhost:3000`
- API Base: `http://localhost:3000/api`
- Database: `lag_vintage_shop`
- Bảng cart: 7 items hiện tại
- Users: 6 users
- Products: 72 sản phẩm

## 🐛 TROUBLESHOOTING

### Lỗi "Không tải được giỏ hàng"
- Kiểm tra server có chạy không: `netstat -ano | findstr :3000`
- Kiểm tra database connection
- Kiểm tra console browser (F12)

### Cart count không update
- Kiểm tra localStorage có userId/sessionId
- Reload page
- Clear localStorage và thử lại

### Số lượng không cập nhật được
- Kiểm tra stock_quantity trong database
- Xem console log backend
- Kiểm tra network tab (F12)

---

**✅ HOÀN TẤT: Chức năng giỏ hàng đã sẵn sàng sử dụng!**
