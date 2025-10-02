# HƯỚNG DẪN KIỂM TRA CÁC TRANG

## Server đang chạy tại: http://localhost:3000

### Các trang có thể truy cập:

1. **Trang chủ**: http://localhost:3000/index.html
2. **Trang sản phẩm**: http://localhost:3000/products.html
3. **Trang đăng nhập**: http://localhost:3000/login.html
4. **Trang đăng ký**: http://localhost:3000/register.html
5. **Trang giỏ hàng**: http://localhost:3000/cart.html
6. **Trang chi tiết sản phẩm**: http://localhost:3000/product-detail.html

### Kiểm tra API:

- API sản phẩm: http://localhost:3000/api/products
- API giỏ hàng: http://localhost:3000/api/cart?sessionId=test123
- API info: http://localhost:3000/api

## Các vấn đề đã sửa:

### 1. Vấn đề trang login
- ✅ Trang login có thể mở được qua: http://localhost:3000/login.html
- ✅ CSS đã có sẵn trong style.css
- ✅ Login.js xử lý đăng nhập và lưu vào localStorage

### 2. Vấn đề giỏ hàng không hiển thị
- ✅ Đã sửa: Tự động tạo sessionId nếu chưa đăng nhập
- ✅ Hiển thị "Giỏ hàng trống" nếu chưa có sản phẩm
- ✅ Thêm log để debug dễ hơn

## Cách test:

1. Mở trình duyệt
2. Truy cập: http://localhost:3000/products.html
3. Thêm sản phẩm vào giỏ hàng
4. Truy cập: http://localhost:3000/cart.html
5. Kiểm tra giỏ hàng đã hiển thị sản phẩm

Hoặc:

1. Mở: http://localhost:3000/login.html
2. Đăng nhập với tài khoản có sẵn
3. Sau khi đăng nhập thành công sẽ chuyển về trang chủ
