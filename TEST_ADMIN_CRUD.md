# Hướng Dẫn Test Admin CRUD Functions

## 📋 Checklist Test

### 1. ✅ Chức Năng Quản Lý Sản Phẩm

#### Test Thêm Sản Phẩm
1. Đăng nhập với tài khoản admin (admin@gmail.com / 123456)
2. Vào trang Admin → Quản lý Sản phẩm
3. Click nút "**+ Thêm sản phẩm**"
4. **Kiểm tra**: Modal hiển thị với tiêu đề "Thêm Sản Phẩm Mới"
5. Điền thông tin:
   - Tên sản phẩm: "Áo Khoác Test"
   - Danh mục: "Áo Khoác"
   - Giá: 250000
   - Số lượng: 10
   - Kích thước: "M, L, XL"
   - Tình trạng: "Tốt"
   - Hình ảnh: "test.jpg"
   - Mô tả: "Sản phẩm test"
6. Click "**Thêm Sản Phẩm**"
7. **Kỳ vọng**:
   - Alert: "Thêm sản phẩm thành công!"
   - Modal đóng
   - Bảng sản phẩm reload và hiển thị sản phẩm mới
   - Sản phẩm xuất hiện ở cuối danh sách

#### Test Sửa Sản Phẩm
1. Trong bảng sản phẩm, tìm sản phẩm "Áo Khoác Test" vừa tạo
2. Click nút "**Sửa**" (màu xanh) ở hàng đó
3. **Kiểm tra**: 
   - Modal hiển thị với tiêu đề "Sửa Sản Phẩm"
   - Form tự động điền đầy đủ thông tin sản phẩm
   - Nút submit đổi thành "Cập Nhật"
4. Thay đổi một số thông tin:
   - Giá: 300000 (thay đổi từ 250000)
   - Số lượng: 15 (thay đổi từ 10)
5. Click "**Cập Nhật**"
6. **Kỳ vọng**:
   - Alert: "Cập nhật sản phẩm thành công!"
   - Modal đóng
   - Bảng reload và hiển thị thông tin mới (300,000₫, 15)

#### Test Xóa Sản Phẩm
1. Tìm sản phẩm "Áo Khoác Test"
2. Click nút "**Xóa**" (màu đỏ)
3. **Kiểm tra**: Xuất hiện dialog xác nhận "Bạn có chắc chắn muốn xóa sản phẩm này?"
4. Click "**OK**" để xác nhận
5. **Kỳ vọng**:
   - Alert: "Xóa sản phẩm thành công!"
   - Bảng reload
   - Sản phẩm "Áo Khoác Test" không còn trong danh sách

#### Test Validation Form
1. Click "**+ Thêm sản phẩm**"
2. Để trống các trường bắt buộc
3. Click "**Thêm Sản Phẩm**"
4. **Kỳ vọng**: Browser validation hiển thị "Vui lòng điền vào trường này"
5. Điền giá âm (ví dụ: -1000)
6. **Kỳ vọng**: Validation không cho nhập số âm

---

### 2. ✅ Chức Năng Quản Lý Đơn Hàng

#### Test Xem Chi Tiết Đơn Hàng
1. Vào tab "**Quản lý Đơn hàng**"
2. **Kiểm tra**: Bảng hiển thị danh sách đơn hàng với:
   - Mã đơn hàng (format: #ORD001, #ORD002...)
   - Tên khách hàng
   - Ngày đặt
   - Tổng tiền (format tiền tệ VN)
   - Trạng thái (màu badge khác nhau)
   - Nút "Xem" và "Cập nhật"
3. Click nút "**Xem**" ở một đơn hàng bất kỳ
4. **Kỳ vọng**: Chuyển đến trang `order-detail.html?id={orderId}`
5. **Kiểm tra trang chi tiết**:
   - Thông tin đơn hàng đầy đủ
   - Danh sách sản phẩm trong đơn
   - Thông tin giao hàng
   - Lịch sử trạng thái

#### Test Cập Nhật Trạng Thái Đơn Hàng
1. Quay lại trang Admin → Quản lý Đơn hàng
2. Chọn một đơn có trạng thái "Chờ xác nhận"
3. Click nút "**Cập nhật**"
4. **Kiểm tra**:
   - Modal hiển thị với mã đơn hàng (ví dụ: #ORD005)
   - Dropdown trạng thái có 5 options:
     * Chờ xác nhận
     * Đã xác nhận
     * Đang giao
     * Đã giao
     * Đã hủy
5. Chọn trạng thái "**Đã xác nhận**"
6. Click "**Cập nhật**"
7. **Kỳ vọng**:
   - Alert: "Cập nhật trạng thái thành công!"
   - Modal đóng
   - Bảng reload
   - Badge trạng thái đổi màu và text thành "Đã xác nhận"

#### Test Các Trạng Thái Khác Nhau
1. Lần lượt test update qua các trạng thái:
   - "Đã xác nhận" → Badge màu xanh info
   - "Đang giao" → Badge màu xanh primary
   - "Đã giao" → Badge màu xanh lá active
   - "Đã hủy" → Badge màu xám inactive
2. **Kỳ vọng**: Mỗi trạng thái có màu riêng biệt và dễ phân biệt

---

### 3. ✅ Chức Năng Quản Lý Khách Hàng

#### Test Xem Chi Tiết Khách Hàng
1. Vào tab "**Quản lý Khách hàng**"
2. **Kiểm tra bảng**: Hiển thị
   - Mã khách hàng
   - Họ tên
   - Email
   - Số điện thoại
   - Tổng đơn hàng
   - Tổng chi tiêu (format VNĐ)
   - Trạng thái
   - Nút "Xem" và "Khóa/Mở khóa"
3. Click nút "**Xem**" ở một khách hàng
4. **Kiểm tra modal hiển thị**:
   - Tiêu đề: "Thông Tin Chi Tiết Khách Hàng"
   - Section "Thông tin cá nhân":
     * Mã khách hàng: #CUS001
     * Họ tên
     * Email
     * Số điện thoại
     * Ngày tham gia (format dd/mm/yyyy)
   - Section "Thống kê":
     * Tổng đơn hàng: số lượng
     * Tổng chi tiêu: format VNĐ
5. Click nút "×" hoặc "**Đóng**"
6. **Kỳ vọng**: Modal đóng và quay về bảng khách hàng

---

### 4. ✅ Chức Năng Thống Kê

#### Test Hiển Thị Thống Kê
1. Vào tab "**Thống kê**"
2. **Kiểm tra 4 card thống kê tổng quan**:
   - Tổng doanh thu (30 ngày)
   - Tổng đơn hàng (30 ngày)
   - Tổng sản phẩm
   - Tổng khách hàng
3. **Kỳ vọng**: Các số liệu hiển thị đúng và format đẹp

#### Test Bộ Lọc Thống Kê
1. Thử các bộ lọc:
   - "**Hôm nay**": Chỉ hiển thị đơn hàng hôm nay
   - "**7 ngày**": Đơn hàng 7 ngày gần đây
   - "**30 ngày**": Đơn hàng 30 ngày gần đây
   - "**Tất cả**": Toàn bộ đơn hàng
2. **Kỳ vọng**: Số liệu thay đổi theo filter

---

## 🐛 Các Lỗi Phổ Biến Cần Kiểm Tra

### Modal Không Hiển Thị
**Triệu chứng**: Click nút "Thêm/Sửa" nhưng modal không xuất hiện

**Cách kiểm tra**:
```javascript
// Mở Console (F12) và chạy:
console.log(document.getElementById('productModal'));
// Nếu null → modal chưa được load trong HTML
```

**Giải pháp**: 
- Kiểm tra file `admin-modal.css` đã được include trong `admin.html`
- Kiểm tra modal có `id` đúng không

### API Endpoint Lỗi
**Triệu chứng**: Alert "Có lỗi xảy ra"

**Cách kiểm tra**:
```javascript
// Console Network tab → Check response:
// Status 400/500 → Lỗi server
// Status 404 → Endpoint không tồn tại
```

**Giải pháp**:
- Kiểm tra server đang chạy: `http://localhost:3000`
- Check backend logs trong terminal

### Bảng Không Reload
**Triệu chứng**: Sau khi thêm/sửa/xóa, bảng không cập nhật

**Cách kiểm tra**:
```javascript
// Console check:
loadProductsTable(); // Manual reload
```

**Giải pháp**: 
- Đảm bảo có gọi `loadProductsTable()` sau mỗi CRUD operation
- Check có lỗi trong console không

---

## 📊 Kết Quả Test Mong Đợi

### ✅ PASS: Tất cả các điều kiện sau
- [ ] Modal mở/đóng mượt mà
- [ ] Form validation hoạt động
- [ ] API calls thành công (Network tab: status 200/201)
- [ ] Alert messages hiển thị đúng
- [ ] Bảng auto reload sau CRUD
- [ ] Data hiển thị chính xác
- [ ] Styling đẹp và responsive

### ❌ FAIL: Nếu có bất kỳ điều kiện nào sau
- Modal không hiển thị
- API trả về lỗi 500
- Bảng không reload
- Data không đúng
- Console có errors

---

## 🔧 Debug Commands

### Kiểm tra server đang chạy
```powershell
# Check port 3000
netstat -ano | findstr :3000
```

### Restart server
```powershell
cd D:\DuANShopQuanAoCu
node backend/server.js
```

### Check database connection
```powershell
node backend/check-db.js
```

### Test API endpoint trực tiếp
```javascript
// Console browser
fetch('http://localhost:3000/api/products')
  .then(r => r.json())
  .then(d => console.log(d));
```

---

## 📝 Test Report Template

```
Date: ____/____/____
Tester: ________________

=== PRODUCT CRUD ===
[ ] Thêm sản phẩm: PASS / FAIL
[ ] Sửa sản phẩm: PASS / FAIL
[ ] Xóa sản phẩm: PASS / FAIL
[ ] Validation: PASS / FAIL

=== ORDER MANAGEMENT ===
[ ] Xem chi tiết đơn: PASS / FAIL
[ ] Cập nhật trạng thái: PASS / FAIL

=== CUSTOMER MANAGEMENT ===
[ ] Xem chi tiết khách hàng: PASS / FAIL

=== STATISTICS ===
[ ] Hiển thị thống kê: PASS / FAIL
[ ] Bộ lọc: PASS / FAIL

Notes:
____________________________
____________________________
```

---

**Happy Testing! 🎉**
