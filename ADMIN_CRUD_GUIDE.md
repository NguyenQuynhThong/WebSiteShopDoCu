# Admin CRUD Operations Guide

## Tổng quan
Hệ thống quản trị admin đã được nâng cấp với đầy đủ các chức năng CRUD (Create, Read, Update, Delete) thông qua giao diện modal hiện đại và thân thiện.

## Các tính năng đã triển khai

### 1. Quản lý Sản phẩm (Products)

#### ✅ Thêm sản phẩm mới
- **Nút**: "Thêm sản phẩm" ở góc trên bên phải bảng
- **Chức năng**: Mở modal form để nhập thông tin sản phẩm mới
- **API Endpoint**: `POST /api/products`
- **Dữ liệu**: Tên, Giá, Danh mục, Mô tả, URL hình ảnh, Số lượng tồn kho
- **Code**: `openAddProductModal()`

#### ✅ Sửa sản phẩm
- **Nút**: "Sửa" (màu xanh) trong mỗi hàng sản phẩm
- **Chức năng**: Load dữ liệu sản phẩm hiện tại vào modal form
- **API Endpoints**: 
  - `GET /api/products/:id` (lấy thông tin)
  - `PUT /api/products/:id` (cập nhật)
- **Code**: `editProduct(productId)`

#### ✅ Xóa sản phẩm
- **Nút**: "Xóa" (màu đỏ) trong mỗi hàng sản phẩm
- **Chức năng**: Xác nhận và xóa sản phẩm
- **API Endpoint**: `DELETE /api/products/:id`
- **Code**: `deleteProduct(productId)`

#### ✅ Xem chi tiết sản phẩm
- **Hiển thị**: Tất cả sản phẩm trong bảng với thông tin đầy đủ
- **API Endpoint**: `GET /api/products`
- **Code**: `loadProductsTable()`

### 2. Quản lý Đơn hàng (Orders)

#### ✅ Cập nhật trạng thái đơn hàng
- **Nút**: "Cập nhật" trong mỗi hàng đơn hàng
- **Chức năng**: Mở modal với dropdown chọn trạng thái mới
- **API Endpoint**: `PUT /api/orders/:orderId/status`
- **Trạng thái**: 
  - pending (Chờ xác nhận)
  - confirmed (Đã xác nhận)
  - shipping (Đang giao)
  - delivered (Đã giao)
  - cancelled (Đã hủy)
- **Code**: `openOrderStatusModal(orderId, orderCode)`

#### ✅ Xem chi tiết đơn hàng
- **Nút**: "Xem" (màu xanh) trong mỗi hàng
- **Chức năng**: Chuyển đến trang chi tiết đơn hàng
- **Code**: `viewOrder(orderId)`

#### ✅ Xem danh sách đơn hàng
- **Hiển thị**: Tất cả đơn hàng với thông tin cơ bản
- **API Endpoint**: `GET /api/orders`
- **Code**: `loadOrdersTable()`

### 3. Quản lý Khách hàng (Customers)

#### ✅ Xem chi tiết khách hàng
- **Nút**: "Xem" trong mỗi hàng khách hàng
- **Chức năng**: Mở modal hiển thị thông tin chi tiết
- **API Endpoint**: `GET /api/users/:userId`
- **Thông tin hiển thị**:
  - Mã khách hàng
  - Họ tên
  - Email
  - Số điện thoại
  - Địa chỉ
  - Ngày tham gia
  - Tổng số đơn hàng
  - Tổng chi tiêu
- **Code**: `viewCustomerDetail(customerId)`

#### ✅ Khóa/Mở khóa tài khoản
- **Nút**: "Khóa"/"Mở khóa" (màu đỏ/xanh) trong mỗi hàng
- **Chức năng**: Chuyển đổi trạng thái active/inactive
- **Code**: `toggleCustomerStatus(customerId, currentStatus)`
- **Lưu ý**: API endpoint đang được phát triển

#### ✅ Xem danh sách khách hàng
- **Hiển thị**: Tất cả khách hàng với thống kê
- **API Endpoint**: `GET /api/users`
- **Code**: `loadCustomersTable()`

### 4. Thống kê (Statistics)

#### ✅ Xem thống kê tổng quan
- **Chức năng**: Hiển thị các chỉ số kinh doanh
- **Dữ liệu**:
  - Tổng doanh thu
  - Tổng đơn hàng
  - Tổng sản phẩm
  - Tổng khách hàng
- **Bộ lọc**: Hôm nay, 7 ngày, 30 ngày, Tất cả
- **Code**: `loadStatistics()`

## Cấu trúc File

### Frontend
```
frontend/
├── admin.html          # Giao diện admin (462 dòng)
├── admin.js            # Logic xử lý (856 dòng)
└── admin-modal.css     # Style cho modal (310 dòng)
```

### Backend
```
backend/
├── models/
│   ├── Product.js      # CRUD sản phẩm
│   ├── Order.js        # CRUD đơn hàng  
│   └── User.js         # CRUD khách hàng
└── routes/
    ├── products.js     # API endpoints sản phẩm
    ├── orders.js       # API endpoints đơn hàng
    └── users.js        # API endpoints khách hàng
```

## API Endpoints Summary

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Tạo sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `PUT /api/orders/:orderId/status` - Cập nhật trạng thái

### Users/Customers
- `GET /api/users` - Lấy danh sách khách hàng
- `GET /api/users/:userId` - Lấy chi tiết khách hàng
- `PUT /api/users/:userId/status` - Cập nhật trạng thái (đang phát triển)

## Hướng dẫn sử dụng

### 1. Đăng nhập Admin
```
Email: admin@gmail.com
Password: 123456
```

### 2. Thao tác với Sản phẩm

**Thêm sản phẩm:**
1. Click nút "Thêm sản phẩm"
2. Điền thông tin vào form:
   - Tên sản phẩm (bắt buộc)
   - Giá (bắt buộc, > 0)
   - Danh mục (chọn từ dropdown)
   - Mô tả
   - URL hình ảnh
   - Số lượng tồn kho
3. Click "Lưu sản phẩm"

**Sửa sản phẩm:**
1. Click nút "Sửa" ở hàng sản phẩm
2. Form sẽ tự động điền dữ liệu hiện tại
3. Chỉnh sửa thông tin cần thiết
4. Click "Cập nhật sản phẩm"

**Xóa sản phẩm:**
1. Click nút "Xóa" ở hàng sản phẩm
2. Xác nhận trong dialog
3. Sản phẩm sẽ bị xóa khỏi database

### 3. Thao tác với Đơn hàng

**Cập nhật trạng thái:**
1. Click nút "Cập nhật" ở hàng đơn hàng
2. Modal hiển thị với mã đơn hàng
3. Chọn trạng thái mới từ dropdown
4. Click "Cập nhật"

**Xem chi tiết:**
1. Click nút "Xem" ở hàng đơn hàng
2. Chuyển đến trang order-detail.html

### 4. Thao tác với Khách hàng

**Xem chi tiết:**
1. Click nút "Xem" ở hàng khách hàng
2. Modal hiển thị đầy đủ thông tin
3. Click "×" hoặc "Đóng" để thoát

## Tính năng Modal

### Ưu điểm
- ✅ Giao diện hiện đại, responsive
- ✅ Animation mượt mà (fadeIn, slideUp)
- ✅ Form validation tích hợp
- ✅ Loading state trong khi xử lý
- ✅ Error handling rõ ràng
- ✅ Close bằng nút ×, nút Đóng, hoặc click overlay

### CSS Classes
```css
.modal              # Container modal
.modal-content      # Nội dung modal
.modal-header       # Header với tiêu đề và nút đóng
.modal-body         # Body chứa nội dung
.modal-footer       # Footer với các action button
.form-group         # Nhóm input trong form
.btn-primary        # Nút chính (màu xanh)
.btn-secondary      # Nút phụ (màu xám)
```

## Validation Rules

### Product Form
- `product_name`: Bắt buộc
- `price`: Bắt buộc, phải > 0
- `category`: Bắt buộc
- `description`: Tùy chọn
- `image_url`: Tùy chọn
- `stock_quantity`: Tùy chọn, mặc định 0

### Order Status
- Phải chọn 1 trong 5 trạng thái
- Không được để trống

## Error Handling

### Frontend
```javascript
try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    if (data.success) {
        // Success
    } else {
        alert(data.message);
    }
} catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra');
}
```

### Backend
```javascript
router.post('/', async (req, res) => {
    try {
        // Validation
        if (!req.body.field) {
            return res.status(400).json({
                success: false,
                message: 'Field is required'
            });
        }
        
        // Process
        const result = await Model.create(req.body);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});
```

## Database Schema

### Products Table
```sql
CREATE TABLE products (
    product_id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(200),
    price DECIMAL(10,2),
    category VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    total_amount DECIMAL(10,2),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Users Table
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(20) DEFAULT 'customer',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing Checklist

### Products CRUD
- [ ] Thêm sản phẩm mới thành công
- [ ] Validation form hoạt động
- [ ] Sửa sản phẩm - form load đúng dữ liệu
- [ ] Sửa sản phẩm - cập nhật thành công
- [ ] Xóa sản phẩm với xác nhận
- [ ] Bảng tự động reload sau mỗi thao tác

### Orders CRUD  
- [ ] Cập nhật trạng thái đơn hàng
- [ ] Modal hiển thị đúng mã đơn hàng
- [ ] Dropdown trạng thái hoạt động
- [ ] Xem chi tiết đơn hàng
- [ ] Bảng tự động reload

### Customers CRUD
- [ ] Xem chi tiết khách hàng
- [ ] Modal hiển thị đầy đủ thông tin
- [ ] Thống kê đơn hàng và chi tiêu chính xác
- [ ] Đóng modal hoạt động
- [ ] Bảng load đúng dữ liệu

### UI/UX
- [ ] Modal animation mượt mà
- [ ] Responsive trên mobile
- [ ] Loading state hiển thị
- [ ] Error messages rõ ràng
- [ ] Success messages sau mỗi action

## Troubleshooting

### Lỗi thường gặp

**1. Modal không hiển thị**
- Kiểm tra console log có lỗi không
- Verify file admin-modal.css đã được load
- Check display style của modal

**2. API không hoạt động**
- Kiểm tra server đang chạy (port 3000)
- Verify database connection
- Check console network tab

**3. Form không submit**
- Kiểm tra validation
- Verify event listener đã được attach
- Check required fields

**4. Data không reload**
- Kiểm tra load function được gọi sau CRUD operation
- Verify API response success = true

## Future Enhancements

### Đang phát triển
- [ ] API endpoint khóa/mở khóa tài khoản khách hàng
- [ ] Upload hình ảnh trực tiếp (thay vì URL)
- [ ] Bulk actions (xóa nhiều sản phẩm cùng lúc)
- [ ] Export data ra Excel/CSV
- [ ] Advanced filtering và search

### Cải tiến UX
- [ ] Toast notifications thay vì alert()
- [ ] Confirm dialog đẹp hơn
- [ ] Loading spinner animations
- [ ] Pagination cho bảng
- [ ] Sort theo cột

## Contacts

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository:
https://github.com/NguyenQuynhThong/WebSiteShopDoCu

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Author**: Development Team
