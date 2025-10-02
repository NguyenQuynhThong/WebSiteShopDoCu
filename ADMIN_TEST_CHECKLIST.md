# 🔍 ADMIN FUNCTIONALITY TEST & FIX CHECKLIST

## 📋 Danh sách chức năng cần kiểm tra

### ✅ 1. **Authentication & Authorization**
- [x] Kiểm tra role-based redirect sau login
- [x] Bảo vệ trang admin (chỉ admin truy cập được)
- [x] Hiển thị thông tin admin
- [x] Chức năng logout

**Status:** ✅ HOÀN TẤT

---

### ✅ 2. **Dashboard Statistics**
- [x] Load dữ liệu thống kê từ database
- [x] Hiển thị doanh thu hôm nay
- [x] Hiển thị số đơn hàng mới
- [x] Hiển thị tổng sản phẩm
- [x] Hiển thị số khách hàng

**Status:** ✅ HOÀN TẤT (với dữ liệu thực từ DB)

---

### ✅ 3. **Product Management (Quản lý sản phẩm)**

#### 3.1 Hiển thị danh sách sản phẩm
- [x] Load sản phẩm từ API
- [x] Hiển thị hình ảnh sản phẩm
- [x] Hiển thị thông tin: ID, tên, danh mục, giá, tồn kho
- [x] Badge trạng thái (Đang bán / Hết hàng)

#### 3.2 Thêm sản phẩm mới
- [ ] Form thêm sản phẩm
- [ ] Upload hình ảnh
- [ ] API endpoint tạo sản phẩm

#### 3.3 Sửa sản phẩm
- [ ] Modal/Form sửa sản phẩm
- [ ] API endpoint cập nhật sản phẩm

#### 3.4 Xóa sản phẩm
- [x] Confirm dialog
- [x] API endpoint xóa sản phẩm
- [x] Reload table sau khi xóa

**Status:** ⚠️ CẦN BỔ SUNG (Chỉ có xóa, chưa có thêm/sửa)

---

### ✅ 4. **Order Management (Quản lý đơn hàng)**

#### 4.1 Hiển thị danh sách đơn hàng
- [x] Load đơn hàng từ API
- [x] Hiển thị: Mã đơn, khách hàng, ngày, tổng tiền, trạng thái
- [x] Badge trạng thái màu sắc theo status

#### 4.2 Xem chi tiết đơn hàng
- [x] Link đến trang order-detail.html
- [ ] Kiểm tra trang chi tiết có load đúng không

#### 4.3 Cập nhật trạng thái đơn hàng
- [x] Prompt nhập trạng thái mới
- [x] API endpoint cập nhật status
- [x] Reload table sau khi cập nhật

**Status:** ✅ CƠ BẢN HOÀN TẤT (Cần improve UX)

---

### ❌ 5. **Customer Management (Quản lý khách hàng)**
- [ ] API lấy danh sách customers
- [ ] Hiển thị table customers
- [ ] Xem chi tiết customer
- [ ] Xem lịch sử đơn hàng của customer

**Status:** ❌ CHƯA TRIỂN KHAI

---

### ❌ 6. **Statistics & Reports (Thống kê & Báo cáo)**
- [ ] Biểu đồ doanh thu theo ngày/tháng
- [ ] Biểu đồ sản phẩm bán chạy
- [ ] Báo cáo tồn kho
- [ ] Export báo cáo

**Status:** ❌ CHƯA TRIỂN KHAI

---

### ⚠️ 7. **Settings (Cài đặt)**
- [ ] Cài đặt thông tin shop
- [ ] Cài đặt phí ship
- [ ] Cài đặt payment methods
- [ ] Đổi mật khẩu admin

**Status:** ❌ CHƯA TRIỂN KHAI

---

## 🐛 CÁC LỖI ĐÃ PHÁT HIỆN & SỬA

### ✅ Lỗi 1: SQL GROUP BY Error
**Mô tả:** `only_full_group_by` error khi query getAllOrders
**Giải pháp:** Thêm tất cả columns vào GROUP BY và dùng MAX() cho payment_status
**Status:** ✅ ĐÃ SỬA

### ✅ Lỗi 2: Không load dữ liệu từ database
**Mô tả:** Trang admin chỉ hiển thị dữ liệu hardcoded
**Giải pháp:** Tạo admin.js với các hàm load data từ API
**Status:** ✅ ĐÃ SỬA

### ✅ Lỗi 3: Không có API lấy tất cả đơn hàng
**Mô tả:** API chỉ có get orders by user, không có get all
**Giải pháp:** Thêm route GET /api/orders và method getAllOrders()
**Status:** ✅ ĐÃ SỬA

### ✅ Lỗi 4: Admin không được redirect sau login
**Mô tả:** Tất cả user đều được redirect về index.html
**Giải pháp:** Check role trong login.js và redirect admin → admin.html
**Status:** ✅ ĐÃ SỬA

---

## 🔧 CẦN BỔ SUNG THÊM

### 1. **Product Management - CRUD đầy đủ**
```javascript
// Backend API needed:
POST   /api/products          - Tạo sản phẩm mới
PUT    /api/products/:id      - Cập nhật sản phẩm
DELETE /api/products/:id      - Xóa sản phẩm (✅ đã có)

// Frontend needed:
- Modal form thêm sản phẩm
- Modal form sửa sản phẩm
- Upload hình ảnh (multer)
```

### 2. **Order Management - Improve UX**
```javascript
// Cần cải thiện:
- Dropdown select status (thay vì prompt)
- Filter orders by status
- Search orders by customer name/code
- Pagination cho danh sách dài
```

### 3. **Customer Management**
```javascript
// Backend API needed:
GET /api/users                - Lấy danh sách khách hàng
GET /api/users/:id            - Chi tiết khách hàng
GET /api/users/:id/orders     - Lịch sử đơn hàng

// Frontend needed:
- Table hiển thị customers
- Modal chi tiết customer
- Tính năng search/filter
```

### 4. **Dashboard - Real-time Stats**
```javascript
// Cần thêm:
- Auto refresh stats mỗi X phút
- Charts (Chart.js hoặc ApexCharts)
- Trending indicators
- Comparison với period trước
```

### 5. **Settings Page**
```javascript
// Cần triển khai:
- Shop info (tên, địa chỉ, hotline)
- Shipping fees config
- Payment methods config
- Admin password change
```

---

## 📝 HƯỚNG DẪN TEST

### Test 1: Login Admin
1. Mở: http://localhost:5500/frontend/login.html
2. Login: admin@lagvintage.com / admin123
3. **Expected:** Redirect đến admin.html
4. **Actual:** ✅ PASS

### Test 2: Dashboard Stats
1. Sau khi login vào admin
2. Kiểm tra 4 stat cards
3. **Expected:** Hiển thị số liệu thực từ database
4. **Actual:** ✅ PASS

### Test 3: Products Table
1. Click vào "Quản lý sản phẩm"
2. **Expected:** Hiển thị danh sách sản phẩm từ DB
3. **Actual:** ✅ PASS

### Test 4: Orders Table
1. Click vào "Đơn hàng"
2. **Expected:** Hiển thị danh sách đơn hàng từ DB
3. **Actual:** ✅ PASS (sau khi sửa SQL)

### Test 5: Delete Product
1. Click nút "Xóa" ở một sản phẩm
2. Confirm dialog
3. **Expected:** Sản phẩm bị xóa, table reload
4. **Actual:** ✅ PASS

### Test 6: Update Order Status
1. Click "Cập nhật" ở một đơn hàng
2. Nhập status mới (pending/confirmed/shipping/delivered/cancelled)
3. **Expected:** Status được cập nhật, table reload
4. **Actual:** ✅ PASS

### Test 7: Logout
1. Click "Đăng xuất"
2. **Expected:** Clear localStorage, redirect login.html
3. **Actual:** ✅ PASS

### Test 8: Access Control
1. Logout admin
2. Login với customer account
3. Truy cập trực tiếp: admin.html
4. **Expected:** Alert "Không có quyền", redirect index.html
5. **Actual:** ✅ PASS

---

## 🎯 PRIORITY TODO LIST

### 🔥 Priority 1 - CRITICAL (Cần làm ngay)
- [x] Fix SQL GROUP BY error ✅
- [x] Load real data từ database ✅
- [ ] Add Product Modal + API
- [ ] Edit Product Modal + API

### ⚡ Priority 2 - HIGH (Quan trọng)
- [ ] Customer Management (list + detail)
- [ ] Order status dropdown (UX improvement)
- [ ] Search & Filter for orders/products
- [ ] Pagination

### 📊 Priority 3 - MEDIUM
- [ ] Dashboard charts
- [ ] Statistics page với filter by date
- [ ] Export reports (Excel/PDF)

### 🎨 Priority 4 - LOW
- [ ] Settings page
- [ ] Admin profile page
- [ ] Activity logs
- [ ] Email notifications

---

## 📌 GHI CHÚ

### Files đã tạo/sửa:
1. ✅ `frontend/admin.js` - JavaScript cho admin dashboard (MỚI)
2. ✅ `frontend/admin.html` - Thêm script src="admin.js"
3. ✅ `frontend/login.js` - Thêm role-based redirect
4. ✅ `backend/routes/orders.js` - Thêm GET / endpoint
5. ✅ `backend/models/Order.js` - Thêm getAllOrders() method
6. ✅ `backend/check-admin.js` - Script kiểm tra admin (MỚI)
7. ✅ `backend/create-admin.js` - Script tạo admin (MỚI)
8. ✅ `ADMIN_GUIDE.md` - Hướng dẫn sử dụng (MỚI)

### API Endpoints hiện có:
```
✅ GET    /api/products              - Lấy danh sách sản phẩm
✅ GET    /api/products/:id          - Chi tiết sản phẩm
✅ DELETE /api/products/:id          - Xóa sản phẩm
✅ GET    /api/orders                - Lấy TẤT CẢ đơn hàng (Admin)
✅ GET    /api/orders/my-orders      - Đơn hàng của user
✅ GET    /api/orders/:id            - Chi tiết đơn hàng
✅ PUT    /api/orders/:id/status     - Cập nhật trạng thái
✅ POST   /api/users/login           - Đăng nhập
✅ GET    /api/users/:id             - Thông tin user
```

### API cần thêm:
```
❌ POST   /api/products              - Tạo sản phẩm
❌ PUT    /api/products/:id          - Cập nhật sản phẩm
❌ POST   /api/products/upload       - Upload hình ảnh
❌ GET    /api/users                 - Danh sách customers
❌ GET    /api/users/:id/orders      - Lịch sử đơn hàng của user
❌ GET    /api/stats/dashboard       - Thống kê dashboard
❌ GET    /api/stats/revenue         - Thống kê doanh thu
```

---

**Last Updated:** October 2, 2025
**Status:** Chức năng cơ bản hoạt động, cần bổ sung CRUD sản phẩm và quản lý khách hàng
