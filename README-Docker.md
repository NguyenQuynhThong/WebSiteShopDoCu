# Docker Deployment cho LAG Vintage Sho### 2. Triển khai với Docker Compose

```bash
# Build và chạy toàn bộ hệ thống
docker-compose up -d --build

# Xem logs để kiểm tra trạng thái
docker-compose logs -f

# Dừng hệ thống
docker-compose down
```

### 3. Truy cập ứng dụng

Sau khi triển khai thành công:

- **Frontend Web App**: http://localhost:8080
- **Backend API**: http://localhost:3002
- **Database**: localhost:3307 (MySQL)

### 4. Kiểm tra trạng thái khai ứng dụng LAG Vintage Shop sử dụng Docker và Docker Compose.

## Yêu cầu hệ thống

- Docker Engine 20.10+
- Docker Compose 2.0+
- Ít nhất 2GB RAM
- Ít nhất 5GB dung lượng ổ cứng

## Cấu trúc dự án

```
lag-vintage-shop/
├── Dockerfile              # Docker image cho backend Node.js
├── docker-compose.yml      # Orchestration cho toàn bộ hệ thống
├── .env.example           # Template cho biến môi trường
├── backend/               # Source code backend
├── frontend/              # Static files frontend
└── README-Docker.md       # Hướng dẫn này
```

## Cách triển khai

### 1. Chuẩn bị môi trường

```bash
# Clone repository (nếu chưa có)
git clone <repository-url>
cd lag-vintage-shop

# Sao chép file cấu hình môi trường
cp .env.example .env

# Chỉnh sửa file .env theo nhu cầu (tùy chọn)
# nano .env
```

### 2. Triển khai với Docker Compose

```bash
# Build và chạy toàn bộ hệ thống
docker-compose up -d

# Xem logs để kiểm tra trạng thái
docker-compose logs -f

# Dừng hệ thống
docker-compose down
```

### 3. Kiểm tra trạng thái

Sau khi triển khai, truy cập:

- **Ứng dụng web**: http://localhost:3000
- **API Base URL**: http://localhost:3000/api
- **Database**: localhost:3306 (từ bên ngoài container)

### 4. Kiểm tra sức khỏe

```bash
# Kiểm tra container đang chạy
docker-compose ps

# Kiểm tra logs của từng service
docker-compose logs mysql
docker-compose logs app

# Test API endpoint
curl http://localhost:3000/api/test-db
```

## Cấu hình chi tiết

### Biến môi trường (.env)

| Biến | Mặc định | Mô tả |
|------|----------|-------|
| `DB_HOST` | localhost | Host database |
| `DB_USER` | lag_user | Username database |
| `DB_PASSWORD` | TVU@842004 | Password database |
| `DB_NAME` | lag_vintage_shop | Tên database |
| `DB_PORT` | 3306 | Port database |
| `DB_ROOT_PASSWORD` | TVU@842004 | Root password MySQL |
| `APP_PORT` | 3001 | Port ứng dụng (không dùng nữa) |
| `BACKEND_PORT` | 3002 | Port backend API |
| `FRONTEND_PORT` | 8080 | Port frontend web app |
| `NODE_ENV` | production | Môi trường Node.js |
| `JWT_SECRET` | - | Secret key cho JWT |
| `GEMINI_API_KEY` | - | API key cho Google Gemini AI |

### Volumes và Persistence

- `mysql_data`: Lưu trữ dữ liệu MySQL persistent
- `./backend/images`: Mount thư mục images
- `./backend/uploads`: Mount thư mục uploads

### Networks

- `lag_vintage_network`: Bridge network cho internal communication

## Lệnh hữu ích

```bash
# Rebuild và restart
docker-compose up -d --build

# Scale services (nếu cần)
docker-compose up -d --scale app=2

# Cleanup
docker-compose down -v  # Xóa volumes
docker system prune     # Dọn dẹp Docker system

# Backup database
docker exec lag_vintage_mysql mysqldump -u lag_user -p lag_vintage_shop > backup.sql

# Restore database
docker exec -i lag_vintage_mysql mysql -u lag_user -p lag_vintage_shop < backup.sql
```

## Troubleshooting

### Lỗi kết nối database
```bash
# Kiểm tra MySQL container
docker-compose logs mysql

# Restart MySQL service
docker-compose restart mysql
```

### Lỗi build Docker image
```bash
# Build với no-cache
docker-compose build --no-cache

# Xem logs build
docker-compose build --progress=plain
```

### Lỗi port conflict
```bash
# Thay đổi port trong .env
APP_PORT=3001
DB_PORT=3307
```

## Production Deployment

Để triển khai production:

1. **Bảo mật**: Thay đổi tất cả passwords mặc định
2. **SSL/TLS**: Sử dụng reverse proxy như Nginx với Let's Encrypt
3. **Monitoring**: Thêm health checks và monitoring
4. **Backup**: Thiết lập automated backup cho database
5. **Scaling**: Sử dụng Docker Swarm hoặc Kubernetes

## API Endpoints

Sau khi triển khai thành công, các API endpoints có sẵn:

- `GET /` - Thông tin API (qua backend: http://localhost:3002)
- `GET /api/test-db` - Test kết nối database
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/categories` - Danh mục sản phẩm
- `POST /api/users/login` - Đăng nhập
- `POST /api/cart` - Thêm vào giỏ hàng
- `POST /api/orders` - Đặt hàng

**Lưu ý**: Frontend tự động proxy API calls đến backend thông qua nginx.

## API Testing với Postman

Dự án đã có sẵn file Postman collection hoàn chỉnh **v2.0.0**:

### 📁 File: `LAG_Vintage_Shop_Postman_Collection.json`

**Cách import và sử dụng:**

1. **Import Collection:**
   - Mở Postman
   - Click "Import" 
   - Chọn file `LAG_Vintage_Shop_Postman_Collection.json`

2. **Cấu hình Environment:**
   - Tạo Environment mới trong Postman
   - Thêm biến: `base_url` = `http://localhost:3000`
   - Hoặc sử dụng biến mặc định trong collection

3. **Thứ tự test API:**
   **Bước 1: Authentication**
   - Chạy "Login User" hoặc "Login Admin" để lấy JWT token
   - Token sẽ tự động lưu vào biến `{{jwt_token}}`
   **Bước 2: Test các API khác**
   - Tất cả request đã có authentication header
   - Biến `{{user_id}}` sẽ tự động cập nhật sau login

4. **Các folder chính:**
   - **Authentication**: Đăng ký, đăng nhập
   - **User Management**: Quản lý tài khoản
   - **Products**: CRUD sản phẩm
   - **Shopping Cart**: Giỏ hàng
   - **Orders**: Đặt hàng, quản lý đơn
   - **Payments**: Thanh toán, QR code
   - **Contacts**: Liên hệ khách hàng
   - **Chatbot**: AI trợ lý
   - **System**: Test kết nối DB

### 🔐 Authentication System

Dự án sử dụng **2 hệ thống authentication khác nhau**:

1. **userId-based Authentication** (cho hầu hết APIs):
   - Cart, Orders, Payments, User profile
   - Gửi `userId` trong body hoặc query parameters
   - Không cần JWT token

2. **JWT Token Authentication** (chỉ cho Admin APIs):
   - Contacts admin endpoints
   - Gửi token trong `Authorization: Bearer {{jwt_token}}` header

### ⚠️ Lưu ý quan trọng (v2.0.0)

- **KHÔNG** set Bearer token authentication globally cho collection
- Chỉ sử dụng JWT token cho Contacts admin endpoints
- Các API khác sử dụng `userId` trong request body/query
- Luôn login trước để có `userId` và `jwt_token`

### 📝 Sample Data

Collection đã có sẵn sample data cho test:
- User: `user@lagvintage.com` / `password`
- Admin: `admin@lagvintage.com` / `admin123`

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Docker và Docker Compose đã cài đặt đúng
2. Ports không bị conflict
3. File .env được cấu hình đúng
4. Logs của containers