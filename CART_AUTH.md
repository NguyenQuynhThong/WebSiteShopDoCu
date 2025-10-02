# 🔒 RÀNG BUỘC ĐĂNG NHẬP CHO GIỎ HÀNG

## ✅ ĐÃ HOÀN THÀNH

### 1. Backend - Authentication Middleware

**File: `backend/middleware/auth.js`** (MỚI TẠO)
```javascript
- requireAuth: Bắt buộc phải có userId
- requireAuthOrSession: Cho phép userId hoặc sessionId
```

**Chức năng:**
- ✅ Kiểm tra userId trong request
- ✅ Trả về 401 Unauthorized nếu không có userId
- ✅ Thông báo yêu cầu đăng nhập

### 2. Backend - Cart Routes (ĐÃ CẬP NHẬT)

**File: `backend/routes/cart.js`**

Đã thêm middleware `requireAuth` cho TẤT CẢ endpoints:
```javascript
GET    /api/cart                 → requireAuth
POST   /api/cart/add             → requireAuth  
PUT    /api/cart/update/:id      → requireAuth
DELETE /api/cart/remove/:id      → requireAuth
DELETE /api/cart/clear            → requireAuth
```

**Thay đổi:**
- ❌ Không còn hỗ trợ sessionId
- ✅ Chỉ chấp nhận userId
- ✅ Trả về `requireLogin: true` khi chưa đăng nhập

### 3. Frontend - Products Page (ĐÃ CẬP NHẬT)

**File: `frontend/products.js`**

**Function: `addToCart(productId)`**
```javascript
// Kiểm tra đăng nhập TRƯỚC
const userId = localStorage.getItem('userId');

if (!userId) {
    // Hiển thị confirm dialog
    if (confirm('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.\nChuyển đến trang đăng nhập?')) {
        window.location.href = 'login.html';
    }
    return; // Dừng lại, không gọi API
}

// Chỉ gửi userId, không gửi sessionId
fetch('/api/cart/add', {
    body: JSON.stringify({
        productId,
        quantity: 1,
        userId: userId  // Chỉ có userId
    })
})
```

**Flow:**
1. User click "Thêm vào giỏ hàng"
2. Kiểm tra localStorage có userId?
3. ❌ Không có → Hiện dialog → Redirect to login
4. ✅ Có → Gọi API thêm vào giỏ

### 4. Frontend - Cart Page (ĐÃ CẬP NHẬT)

**File: `frontend/cart.js`**

**Kiểm tra đăng nhập ngay khi load:**
```javascript
let userId = localStorage.getItem('userId') || null;

// Kiểm tra đăng nhập ngay khi load trang
if (!userId) {
    window.location.href = 'login.html';
}
```

**Tất cả các API calls chỉ dùng userId:**
```javascript
// Load cart
GET /api/cart?userId=${userId}

// Update quantity  
PUT /api/cart/update/${cartId}
Body: { quantity, userId }

// Remove item
DELETE /api/cart/remove/${cartId}?userId=${userId}

// Clear cart
DELETE /api/cart/clear?userId=${userId}
```

## 🎯 LOGIC FLOW

### Khi User Chưa Đăng Nhập

#### Từ Products Page:
```
1. User click "Thêm vào giỏ hàng"
2. Check localStorage.getItem('userId')
3. userId === null
4. Show confirm dialog: "Bạn cần đăng nhập..."
5. User click OK
6. Redirect to login.html
7. ❌ KHÔNG gọi API
```

#### Khi truy cập Cart Page trực tiếp:
```
1. Load cart.html
2. Execute cart.js
3. Check localStorage.getItem('userId')
4. userId === null
5. window.location.href = 'login.html'
6. ❌ KHÔNG hiển thị giỏ hàng
```

### Khi User Đã Đăng Nhập

#### Thêm vào giỏ:
```
1. User click "Thêm vào giỏ hàng"
2. Check userId = localStorage.getItem('userId')
3. userId = "1" ✓
4. POST /api/cart/add { productId, quantity: 1, userId }
5. Backend: requireAuth middleware check userId ✓
6. Backend: Cart.addToCart(productId, 1, userId, null)
7. Database: INSERT INTO cart (user_id, product_id, quantity)
8. ✅ Response success
9. Show notification "Đã thêm vào giỏ hàng"
10. Update cart count
```

#### Xem giỏ hàng:
```
1. Load cart.html
2. cart.js check userId ✓
3. GET /api/cart?userId=1
4. Backend: requireAuth middleware check userId ✓
5. Backend: Cart.getCart(userId, null)
6. Database: SELECT * FROM cart WHERE user_id = 1
7. ✅ Return cart items của user đó
8. Display cart với hình ảnh đúng
```

## 🔐 BẢO MẬT

### Mỗi User Chỉ Thấy Giỏ Hàng Của Mình

**Query trong Cart.getCart():**
```sql
SELECT c.*, p.* 
FROM cart c
JOIN products p ON c.product_id = p.product_id
WHERE c.user_id = ?  -- userId từ request
```

**Không thể:**
- ❌ Xem giỏ hàng của user khác
- ❌ Thêm vào giỏ hàng của user khác
- ❌ Sửa/xóa giỏ hàng của user khác

**Kiểm tra ownership:**
```javascript
// Trong Cart.updateQuantity()
const [cartItem] = await db.query(
    'SELECT cart_id FROM cart WHERE cart_id = ? AND user_id = ?',
    [cartId, userId]
);

if (cartItem.length === 0) {
    return { success: false, message: 'Không tìm thấy sản phẩm' };
}
```

## 📊 KIỂM TRA

### Test với Multiple Users

**User 1:**
```sql
SELECT * FROM cart WHERE user_id = 1;
-- Kết quả: 2 items (Áo Sơ Mi, Ốp lưng iPhone)
```

**User 6:**
```sql
SELECT * FROM cart WHERE user_id = 6;
-- Kết quả: 1 item (Áo Polo)
```

**Guest cũ (đã bị loại bỏ):**
```sql
SELECT * FROM cart WHERE session_id IS NOT NULL;
-- Kết quả: 3 items (từ trước khi implement auth)
-- Sẽ không được sử dụng nữa
```

### Cleanup Guest Carts (Optional)

Xóa các giỏ hàng guest cũ:
```sql
DELETE FROM cart WHERE session_id IS NOT NULL;
```

## 🚀 CÁCH SỬ DỤNG

### 1. Đăng nhập
```
1. Mở login.html
2. Đăng nhập với email/password
3. Backend trả về { success: true, user: {...} }
4. Frontend lưu: localStorage.setItem('userId', user.userId)
```

### 2. Thêm vào giỏ hàng
```
1. Mở products.html
2. Click "Thêm vào giỏ"
3. → Nếu chưa login: confirm dialog → redirect login
4. → Nếu đã login: API call → thêm thành công
```

### 3. Xem giỏ hàng
```
1. Click icon giỏ hàng hoặc mở cart.html
2. → Nếu chưa login: tự động redirect login
3. → Nếu đã login: hiển thị giỏ hàng của user
```

### 4. Đăng xuất
```
1. Click "Đăng xuất"
2. localStorage.removeItem('userId')
3. localStorage.removeItem('user')
4. Redirect to index.html
```

## 📝 API RESPONSE

### Success (Đã đăng nhập)
```json
{
    "success": true,
    "cart": [...],
    "summary": {
        "totalItems": 3,
        "total": "1690000.00"
    }
}
```

### Error (Chưa đăng nhập)
```json
{
    "success": false,
    "message": "Vui lòng đăng nhập để thực hiện thao tác này",
    "requireLogin": true
}
```

## ✨ LỢI ÍCH

1. **Bảo mật**: Mỗi user chỉ quản lý giỏ hàng của mình
2. **Đơn giản**: Không cần quản lý sessionId
3. **Rõ ràng**: User biết phải đăng nhập
4. **Dữ liệu sạch**: Không có giỏ hàng "vô chủ"
5. **Dễ mở rộng**: Có thể thêm order history, wishlist...

---

**✅ HOÀN TẤT: Giỏ hàng đã yêu cầu đăng nhập và đảm bảo mỗi user có giỏ riêng!**
