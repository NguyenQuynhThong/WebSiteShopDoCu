# Hướng Dẫn Sử Dụng Chức Năng Cài Đặt (Settings)

## 📋 Tổng Quan

Section **Cài đặt** trong Admin Panel cung cấp 5 phần chính để quản lý hệ thống:

1. 👤 **Thông Tin Admin** - Cập nhật thông tin cá nhân
2. 🔒 **Đổi Mật Khẩu** - Thay đổi mật khẩu đăng nhập
3. 🏪 **Thông Tin Cửa Hàng** - Quản lý thông tin shop
4. 💾 **Quản Lý Dữ Liệu** - Backup, restore, xóa cache
5. 📊 **Thông Tin Hệ Thống** - Hiển thị phiên bản, database, server

---

## 🎯 Cách Sử Dụng

### 1️⃣ Thông Tin Admin

**Chức năng**: Cập nhật thông tin cá nhân của Admin

**Các trường:**
- **Họ và tên**: Tên đầy đủ của admin
- **Email**: Email đăng nhập (readonly - không thể sửa)
- **Số điện thoại**: Số điện thoại liên hệ
- **Vai trò**: Administrator (readonly)

**Cách sử dụng:**
1. Vào tab **"⚙️ Cài đặt"** trong sidebar
2. Tìm card **"👤 Thông Tin Admin"**
3. Chỉnh sửa **Họ và tên** hoặc **Số điện thoại**
4. Click nút **"💾 Lưu thông tin"**
5. ✅ Nếu thành công: Alert "Cập nhật thông tin thành công!"
6. Thông tin được cập nhật trong database và localStorage

**API Endpoint:**
```
PUT /api/users/:userId
Body: { fullName: "...", phone: "..." }
```

---

### 2️⃣ Đổi Mật Khẩu

**Chức năng**: Thay đổi mật khẩu đăng nhập

**Các trường:**
- **Mật khẩu hiện tại**: Mật khẩu đang dùng (required)
- **Mật khẩu mới**: Mật khẩu mới (required, min 6 ký tự)
- **Xác nhận mật khẩu**: Nhập lại mật khẩu mới (required)

**Validation:**
- ✅ Mật khẩu mới phải có ít nhất 6 ký tự
- ✅ Mật khẩu mới và xác nhận phải khớp nhau
- ✅ Mật khẩu hiện tại phải đúng

**Cách sử dụng:**
1. Vào card **"🔒 Đổi Mật Khẩu"**
2. Nhập **Mật khẩu hiện tại**
3. Nhập **Mật khẩu mới** (tối thiểu 6 ký tự)
4. Nhập lại **Xác nhận mật khẩu**
5. Click nút **"🔑 Đổi mật khẩu"**
6. ✅ Nếu thành công: Alert "Đổi mật khẩu thành công!" và form reset

**Lỗi thường gặp:**
- ❌ "Mật khẩu mới và xác nhận mật khẩu không khớp!"
- ❌ "Mật khẩu mới phải có ít nhất 6 ký tự!"
- ❌ "Mật khẩu cũ không đúng"

**API Endpoint:**
```
PUT /api/users/:userId/change-password
Body: { oldPassword: "...", newPassword: "..." }
```

---

### 3️⃣ Thông Tin Cửa Hàng

**Chức năng**: Quản lý thông tin hiển thị của cửa hàng

**Các trường:**
- **Tên cửa hàng**: LAG Vintage Shop
- **Địa chỉ**: Địa chỉ đầy đủ
- **Số điện thoại**: SĐT liên hệ shop
- **Email**: Email liên hệ shop
- **Mô tả cửa hàng**: Mô tả ngắn gọn về shop

**Cách sử dụng:**
1. Vào card **"🏪 Thông Tin Cửa Hàng"**
2. Chỉnh sửa các trường thông tin
3. Click nút **"💾 Lưu thông tin"**
4. ✅ Thông tin được lưu vào localStorage

**Lưu ý:**
- 📝 Hiện tại đang lưu vào localStorage (mock data)
- 🚀 Trong production nên tạo API endpoint để lưu vào database
- 💡 Có thể hiển thị thông tin này ở frontend (footer, contact page)

---

### 4️⃣ Quản Lý Dữ Liệu

**Chức năng**: Backup, restore và xóa cache hệ thống

#### 📦 Sao lưu dữ liệu
**Mô tả**: Tạo file backup của database

**Cách sử dụng:**
1. Click nút **"📦 Sao lưu dữ liệu"**
2. Confirm dialog xuất hiện
3. Click **OK** để xác nhận
4. ✅ Alert "Sao lưu dữ liệu thành công!"
5. File backup: `backup_YYYY-MM-DD.sql`

**Lưu ý:**
- ⚠️ Chức năng này đang ở chế độ MOCK
- 🚀 Cần implement backend API để thực hiện mysqldump
- 💾 Nên sao lưu định kỳ hàng tuần

#### ♻️ Khôi phục dữ liệu
**Mô tả**: Restore database từ file backup

**Cách sử dụng:**
1. Click nút **"♻️ Khôi phục dữ liệu"**
2. Confirm dialog cảnh báo ghi đè dữ liệu
3. Click **OK** để xác nhận
4. ✅ Alert "Khôi phục dữ liệu thành công!"

**Lưu ý:**
- ⚠️ **NGUY HIỂM**: Sẽ ghi đè toàn bộ dữ liệu hiện tại
- 🚀 Chức năng đang ở chế độ MOCK
- 📂 Cần có file backup để restore

#### 🗑️ Xóa cache
**Mô tả**: Xóa tất cả cache localStorage (giữ lại session đăng nhập)

**Cách sử dụng:**
1. Click nút **"🗑️ Xóa cache"**
2. Confirm dialog xuất hiện
3. Click **OK** để xác nhận
4. ✅ Cache bị xóa, trang reload tự động
5. User vẫn đăng nhập (session được giữ lại)

**Khi nào dùng:**
- 🐛 Khi gặp lỗi hiển thị do cache cũ
- 🔄 Sau khi cập nhật dữ liệu lớn
- 🧹 Để làm mới toàn bộ dữ liệu tạm

---

### 5️⃣ Thông Tin Hệ Thống

**Chức năng**: Hiển thị thông tin về hệ thống (readonly)

**Thông tin hiển thị:**

| Trường | Giá trị | Mô tả |
|--------|---------|-------|
| **Phiên bản** | v1.0.0 | Version của ứng dụng |
| **Database** | MySQL - lag_vintage_shop | Tên database đang dùng |
| **Server** | Node.js Express | Backend framework |
| **Kết nối** | 🟢 Hoạt động | Trạng thái server |
| **Lần cập nhật cuối** | 02/10/2025 | Ngày deploy gần nhất |

**Ý nghĩa màu status:**
- 🟢 **Hoạt động** (Active): Server đang chạy bình thường
- 🟡 **Cảnh báo** (Warning): Có vấn đề nhỏ
- 🔴 **Lỗi** (Error): Server gặp sự cố

---

## 🔧 Troubleshooting

### ❌ Vấn đề: Form không submit được

**Triệu chứng:**
- Click nút "Lưu" nhưng không có gì xảy ra
- Không có alert nào hiển thị

**Nguyên nhân:**
- JavaScript chưa được load
- Form handlers chưa được attach
- Console có lỗi

**Giải pháp:**
1. Mở Console (F12)
2. Check lỗi JavaScript
3. Reload trang (Ctrl+R)
4. Kiểm tra `setupSettingsHandlers()` đã được gọi

---

### ❌ Vấn đề: Cập nhật thông tin thất bại

**Triệu chứng:**
- Alert "Không thể cập nhật thông tin"
- API trả về lỗi

**Nguyên nhân:**
- Server không chạy
- userId không đúng
- Database connection bị lỗi

**Giải pháp:**
1. Check server đang chạy: `http://localhost:3000`
2. Kiểm tra Console Network tab
3. Verify userId trong localStorage
4. Check backend logs

**Debug commands:**
```javascript
// Check user info
console.log(JSON.parse(localStorage.getItem('user')));

// Test API
fetch('http://localhost:3000/api/users/1')
  .then(r => r.json())
  .then(d => console.log(d));
```

---

### ❌ Vấn đề: Đổi mật khẩu không thành công

**Triệu chứng:**
- Alert "Mật khẩu cũ không đúng"

**Nguyên nhân:**
- Nhập sai mật khẩu hiện tại
- Password trong database đã thay đổi

**Giải pháp:**
1. Kiểm tra lại mật khẩu hiện tại
2. Nếu quên mật khẩu, cần reset qua database:
```sql
-- Reset password về "123456"
UPDATE users 
SET password = '$2b$10$...' 
WHERE user_id = 1;
```

---

### ❌ Vấn đề: Settings không hiển thị

**Triệu chứng:**
- Click "Cài đặt" trong sidebar nhưng không thấy gì

**Nguyên nhân:**
- Section Settings có `display: none`
- JavaScript navigation không hoạt động

**Giải pháp:**
1. Check HTML có section `id="settings"` không
2. Kiểm tra sidebar navigation code
3. Manual test:
```javascript
// Force show settings
document.getElementById('settings').style.display = 'block';
```

---

## 📝 Code Reference

### JavaScript Functions

```javascript
// Load settings data
loadAdminSettings()

// Setup all form handlers
setupSettingsHandlers()

// Database actions
backupDatabase()
restoreDatabase()
clearCache()
```

### HTML Elements

```html
<!-- Forms -->
#adminProfileForm
#changePasswordForm
#shopInfoForm

<!-- Input Fields -->
#adminFullName
#adminEmail
#adminPhone
#currentPassword
#newPassword
#confirmPassword
#shopName
#shopAddress
#shopPhone
#shopEmail
#shopDescription
```

---

## 🚀 Future Enhancements

### Đang phát triển:
- [ ] Real backup/restore functionality với mysqldump
- [ ] Upload avatar cho admin
- [ ] Email notification khi đổi mật khẩu
- [ ] Two-factor authentication (2FA)
- [ ] Activity log (lịch sử thay đổi)

### Cải tiến UX:
- [ ] Toast notifications thay vì alert()
- [ ] Progress bar cho backup/restore
- [ ] Form validation real-time
- [ ] Preview thông tin trước khi save
- [ ] Undo/Redo cho thay đổi

---

## 📞 Support

Nếu gặp vấn đề với chức năng Settings:

1. **Check Console**: F12 → Console tab
2. **Check Network**: F12 → Network tab  
3. **Check Backend Logs**: Terminal đang chạy server
4. **Check Database**: MySQL Workbench

**Repository**: https://github.com/NguyenQuynhThong/WebSiteShopDoCu

---

**Version**: 1.0.0  
**Last Updated**: 02/10/2025  
**Author**: Development Team
