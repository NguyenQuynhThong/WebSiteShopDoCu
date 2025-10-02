# LAG Vintage Shop - Hướng Dẫn Cài Đặt và Sử Dụng

## 📋 Giới Thiệu

Dự án website bán quần áo cũ và sản phẩm công nghệ cũ với chức năng tìm kiếm và lọc sản phẩm.

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Node.js** + **Express.js** - Server framework
- **MySQL** - Database
- **mysql2** - MySQL client cho Node.js
- **dotenv** - Quản lý biến môi trường
- **cors** - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Cấu trúc trang web
- **CSS3** - Styling và responsive
- **JavaScript (Vanilla)** - Tương tác và gọi API

## 📦 Cài Đặt

### 1. Cài Đặt Dependencies

```powershell
# Di chuyển vào thư mục backend
cd backend

# Cài đặt packages
npm install
```

### 2. Cấu Hình Database

Đảm bảo MySQL đang chạy, sau đó import database schema:

```powershell
# Truy cập MySQL
mysql -u root -p

# Chạy script SQL
source backend/database/init.sql
```

Hoặc import trực tiếp trong MySQL Workbench:
- Mở file `backend/database/init.sql`
- Chạy toàn bộ script

### 3. Cấu Hình File .env

File `.env` đã có sẵn với cấu hình:

```env
# Server
PORT=3000
NODE_ENV=development

# Database MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TVU@842004
DB_NAME=lag_vintage_shop
DB_PORT=3306
```

**Lưu ý**: Đổi `DB_PASSWORD` nếu mật khẩu MySQL của bạn khác.

## 🚀 Chạy Ứng Dụng

### 1. Khởi Động Backend Server

```powershell
cd backend
npm start
```

Hoặc để chạy ở chế độ development (auto-restart):

```powershell
npm run dev
```

Server sẽ chạy tại: `http://localhost:3000`

### 2. Mở Frontend

Mở file `frontend/products.html` bằng:
- Live Server extension trong VS Code
- Hoặc mở trực tiếp trong trình duyệt

## 📁 Cấu Trúc Thư Mục

```
DuANShopQuanAoCu/
├── backend/
│   ├── config/
│   │   └── database.js          # Cấu hình kết nối MySQL
│   ├── models/
│   │   └── Product.js            # Model sản phẩm
│   ├── routes/
│   │   └── products.js           # API routes cho sản phẩm
│   ├── database/
│   │   └── init.sql              # Schema và dữ liệu mẫu
│   ├── images/                   # Hình ảnh sản phẩm
│   ├── .env                      # Biến môi trường
│   ├── package.json              # Dependencies
│   └── server.js                 # Entry point
│
└── frontend/
    ├── components/               # Components tái sử dụng
    ├── products.html             # Trang sản phẩm
    ├── products.js               # JavaScript cho trang sản phẩm
    └── style.css                 # Styles
```

## 🔍 Chức Năng Tìm Kiếm

### API Endpoints

#### 1. Lấy Tất Cả Sản Phẩm
```
GET /api/products?page=1&limit=20&category=all
```

#### 2. Tìm Kiếm Sản Phẩm
```
GET /api/products/search?q=keyword&category=clothing&priceRange=0-500k&page=1&limit=20
```

**Parameters:**
- `q` (required): Từ khóa tìm kiếm
- `category` (optional): `all`, `clothing`, `tech`
- `priceRange` (optional): `all`, `0-500k`, `500k-2m`, `2m-5m`, `5m+`
- `page` (optional): Số trang (mặc định: 1)
- `limit` (optional): Số sản phẩm/trang (mặc định: 20)

#### 3. Lấy Chi Tiết Sản Phẩm
```
GET /api/products/:id
```

### Frontend Features

1. **Thanh Tìm Kiếm**
   - Nhập từ khóa và nhấn nút "Tìm kiếm" hoặc Enter
   - Hiển thị số lượng kết quả tìm được
   - Nút xóa tìm kiếm để quay lại danh sách đầy đủ

2. **Bộ Lọc**
   - Lọc theo danh mục (Quần áo / Công nghệ)
   - Lọc theo khoảng giá
   - Sắp xếp (Mới nhất, Giá tăng/giảm, Phổ biến)

3. **Phân Trang**
   - Hiển thị 20 sản phẩm/trang
   - Nút Previous/Next
   - Số trang hiện tại

4. **Loading & Error States**
   - Hiển thị spinner khi đang tải
   - Thông báo khi không có kết quả
   - Error handling

## 📊 Database Schema

### Bảng `products`

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | INT | Primary key |
| name | VARCHAR(255) | Tên sản phẩm |
| description | TEXT | Mô tả chi tiết |
| category | VARCHAR(50) | `clothing` hoặc `tech` |
| price | DECIMAL(10,2) | Giá hiện tại |
| old_price | DECIMAL(10,2) | Giá cũ (nếu có) |
| image | VARCHAR(500) | Đường dẫn hình ảnh |
| stock | INT | Số lượng tồn kho |
| condition_percentage | INT | Tình trạng (%) |
| size | VARCHAR(50) | Kích cỡ (nếu là quần áo) |
| badge | VARCHAR(20) | Nhãn (Hot, New, Sale) |
| created_at | TIMESTAMP | Ngày tạo |
| updated_at | TIMESTAMP | Ngày cập nhật |

## 🧪 Testing API

### Sử dụng cURL

```powershell
# Lấy tất cả sản phẩm
curl http://localhost:3000/api/products

# Tìm kiếm
curl "http://localhost:3000/api/products/search?q=jean"

# Tìm kiếm với filter
curl "http://localhost:3000/api/products/search?q=áo&category=clothing&priceRange=0-500k"

# Lấy chi tiết sản phẩm
curl http://localhost:3000/api/products/1
```

### Sử dụng Browser

Mở trong trình duyệt:
```
http://localhost:3000/api/products
http://localhost:3000/api/products/search?q=iphone
```

## 🐛 Troubleshooting

### Lỗi Kết Nối Database

```
❌ Lỗi kết nối database: Access denied for user 'root'@'localhost'
```

**Giải pháp:**
1. Kiểm tra MySQL có đang chạy
2. Kiểm tra username/password trong file `.env`
3. Đảm bảo database `lag_vintage_shop` đã được tạo

### Port 3000 Đã Được Sử Dụng

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Giải pháp:**
```powershell
# Tìm và kill process đang dùng port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc đổi port trong file .env
PORT=3001
```

### CORS Error

Nếu gặp lỗi CORS khi gọi API từ frontend:
- Đảm bảo đã cài `cors` package
- Server đã config `app.use(cors())`

## 📝 TODO

- [ ] Thêm chức năng giỏ hàng
- [ ] Xây dựng trang chi tiết sản phẩm
- [ ] Thêm authentication (đăng nhập/đăng ký)
- [ ] Upload hình ảnh sản phẩm
- [ ] Admin dashboard
- [ ] Review và rating sản phẩm

## 👥 Đóng Góp

Dự án phát triển bởi nhóm sinh viên TVU.

## 📄 License

MIT License
