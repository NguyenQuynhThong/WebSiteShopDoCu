# 🐛 BUG FIX - SQL Syntax Error

## ❌ Lỗi Gặp Phải

```
Error: You have an error in your SQL syntax; 
check the manual that corresponds to your MySQL server version 
for the right syntax to use near ''20' OFFSET 0' at line 1

sql: "SELECT * FROM products WHERE 1=1 ORDER BY created_at DESC LIMIT '20' OFFSET 0"
```

## 🔍 Nguyên Nhân

Khi Express nhận query parameters từ URL (ví dụ: `?page=1&limit=20`), các giá trị này được truyền dưới dạng **string**, không phải **number**.

MySQL không chấp nhận giá trị string cho `LIMIT` và `OFFSET`, dẫn đến lỗi SQL syntax khi query được thực thi:
- ❌ `LIMIT '20'` → SAI (string)
- ✅ `LIMIT 20` → ĐÚNG (number)

## ✅ Giải Pháp

Đã chỉnh sửa file `backend/models/Product.js` để convert các tham số `page` và `limit` sang kiểu số nguyên trước khi sử dụng trong SQL query.

### Thay Đổi Trong Các Methods:

#### 1. Method `getAll()`
```javascript
// TRƯỚC (LỖI)
static async getAll(page = 1, limit = 20, category = null) {
    const offset = (page - 1) * limit;
    // ...
    params.push(limit, offset);  // ← limit và offset có thể là string
}

// SAU (FIX)
static async getAll(page = 1, limit = 20, category = null) {
    // Convert to integers to avoid SQL syntax errors
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;
    // ...
    params.push(limitNum, offset);  // ← Đảm bảo là number
}
```

#### 2. Method `search()`
```javascript
// TRƯỚC (LỖI)
static async search(keyword, category = null, priceRange = null, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    // ...
}

// SAU (FIX)
static async search(keyword, category = null, priceRange = null, page = 1, limit = 20) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;
    // ...
}
```

#### 3. Method `getByCategory()`
```javascript
// TRƯỚC (LỖI)
static async getByCategory(category, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    // ...
}

// SAU (FIX)
static async getByCategory(category, page = 1, limit = 20) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;
    const offset = (pageNum - 1) * limitNum;
    // ...
}
```

## 🧪 Kiểm Tra

Sau khi fix, các API endpoints sau hoạt động bình thường:

```
✅ GET /api/products?page=1&limit=20
✅ GET /api/products/search?q=jean&page=1&limit=20
✅ GET /api/products/category/clothing?page=1&limit=10
```

## 📝 Bài Học

1. **Type Safety**: Luôn kiểm tra và convert kiểu dữ liệu từ query parameters
2. **Default Values**: Sử dụng `|| 1` và `|| 20` để đảm bảo có giá trị mặc định
3. **SQL Parameters**: MySQL yêu cầu LIMIT/OFFSET phải là số nguyên, không phải string

## 🚀 Cách Restart Server

Nếu gặp lỗi tương tự, restart server để áp dụng code mới:

```powershell
# Stop server (Ctrl+C trong terminal đang chạy)
# Hoặc kill process:
Get-Process node | Stop-Process -Force

# Restart server
cd backend
node server.js
```

## ✅ Status

- [x] Fixed `getAll()` method
- [x] Fixed `search()` method  
- [x] Fixed `getByCategory()` method
- [x] Server restarted
- [x] API tested and working

**Lỗi đã được sửa hoàn toàn! ✨**
