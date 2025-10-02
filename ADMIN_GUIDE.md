# 👨‍💼 ADMIN PANEL GUIDE

## 🔐 Tài khoản Admin

### Thông tin đăng nhập mặc định:
- **Email:** `admin@lagvintage.com`
- **Password:** `admin123`
- **URL Login:** http://localhost:5500/frontend/login.html

## ✨ Tính năng đã triển khai

### 1. **Kiểm tra Role khi đăng nhập**
- ✅ Khi đăng nhập bằng tài khoản admin → Chuyển đến `admin.html`
- ✅ Khi đăng nhập bằng tài khoản customer → Chuyển đến `index.html`

### 2. **Bảo vệ trang Admin**
- ✅ Chỉ user có `role = 'admin'` mới truy cập được `admin.html`
- ✅ Nếu chưa đăng nhập → Chuyển về `login.html`
- ✅ Nếu không phải admin → Chuyển về `index.html`

### 3. **Hiển thị thông tin Admin**
- ✅ Tên admin hiển thị trên header
- ✅ Avatar với chữ cái đầu của tên

### 4. **Chức năng Logout**
- ✅ Xóa thông tin user khỏi localStorage
- ✅ Chuyển về trang login

## 🚀 Cách sử dụng

### Kiểm tra tài khoản admin:
```bash
cd backend
node check-admin.js
```

### Tạo tài khoản admin mới:
```bash
cd backend
node create-admin.js
```

### Test chức năng:

1. **Mở trình duyệt tại:** http://localhost:5500/frontend/login.html

2. **Đăng nhập với tài khoản admin:**
   - Email: `admin@lagvintage.com`
   - Password: `admin123`

3. **Kết quả:** Bạn sẽ được chuyển đến trang `admin.html` (Admin Dashboard)

4. **Đăng xuất và test với customer:**
   - Tạo tài khoản mới hoặc dùng tài khoản customer
   - Đăng nhập → Sẽ chuyển về `index.html`

## 📋 Files đã chỉnh sửa

### 1. `frontend/login.js`
```javascript
// Thêm logic kiểm tra role và chuyển hướng
if (data.user.role === 'admin') {
    window.location.href = 'admin.html';
} else {
    window.location.href = 'index.html';
}
```

### 2. `frontend/admin.html`
```javascript
// Thêm script kiểm tra quyền admin
window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || user.role !== 'admin') {
        alert('Bạn không có quyền truy cập');
        window.location.href = 'login.html';
    }
});
```

### 3. `backend/check-admin.js` (Mới)
- Script kiểm tra danh sách admin trong database

### 4. `backend/create-admin.js` (Mới)
- Script tạo tài khoản admin mới

## 🔧 Cấu trúc Database

### Table: `users`
```sql
- user_id (INT, Primary Key)
- email (VARCHAR)
- password (VARCHAR, hashed)
- full_name (VARCHAR)
- phone (VARCHAR)
- role (ENUM: 'customer', 'admin') ← Quan trọng!
- status (ENUM: 'active', 'inactive')
- created_at (DATETIME)
- last_login (DATETIME)
```

## 🎯 Luồng hoạt động

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │
       ├─── Admin Account (role='admin')
       │    └─→ admin.html ✅
       │
       └─── Customer Account (role='customer')
            └─→ index.html ✅
```

## 🛡️ Bảo mật

1. ✅ Password được hash bằng bcrypt
2. ✅ Kiểm tra role ở cả client-side và server-side
3. ✅ Admin route được bảo vệ
4. ✅ Session management với localStorage

## 📝 Ghi chú

- Tài khoản admin được tạo tự động khi chạy lần đầu
- Mật khẩu mặc định: `admin123` (nên đổi sau khi đăng nhập lần đầu)
- Admin có thể quản lý sản phẩm, đơn hàng, khách hàng
- Trang admin responsive và user-friendly

## 🐛 Troubleshooting

### Không thể đăng nhập admin?
```bash
# Kiểm tra tài khoản admin
node backend/check-admin.js

# Reset password admin (nếu cần)
# Cập nhật trực tiếp trong database hoặc tạo admin mới
```

### Bị chuyển về trang chủ khi vào admin?
- Kiểm tra localStorage: `localStorage.getItem('user')`
- Đảm bảo `role` là `'admin'`
- Xóa cache và thử lại

### Làm mới database?
- Import lại schema SQL
- Chạy `node backend/create-admin.js` để tạo admin mới

---

**🎉 Chúc bạn sử dụng hệ thống admin thành công!**
