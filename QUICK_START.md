# ⚡ HƯỚNG DẪN KHỞI ĐỘNG NHANH

## 🔧 YÊU CẦU

- ✅ Node.js (đã cài)
- ✅ MySQL (đang chạy)
- ✅ VS Code với extension Live Server

## 🚀 4 BƯỚC ĐỂ CHẠY

### Bước 1: Cài đặt dependencies (ĐÃ XONG)
```powershell
cd backend
npm install  # ✅ Đã cài xong
```

### Bước 2: Import Database
```powershell
# Mở MySQL và chạy:
mysql -u root -p
# Nhập password: TVU@842004

# Trong MySQL, chạy:
source backend/database/init.sql
# Hoặc: source D:/DuANShopQuanAoCu/backend/database/init.sql
```

**Hoặc dùng MySQL Workbench:**
- File → Open SQL Script → Chọn `backend/database/init.sql`
- Nhấn Execute (⚡ icon)

### Bước 3: Khởi động Backend
```powershell
cd backend
npm start
```

Bạn sẽ thấy:
```
🚀 Server đang chạy tại http://localhost:3000
📦 Environment: development
✅ Kết nối database thành công!
```

**LƯU Ý:** Để terminal này chạy, đừng tắt!

### Bước 4: Mở Frontend

**Cách 1 - Dùng Live Server (Khuyên dùng):**
1. Mở file `frontend/products.html` trong VS Code
2. Click chuột phải → "Open with Live Server"
3. Trang web sẽ mở tại `http://127.0.0.1:5500/frontend/products.html`

**Cách 2 - Mở trực tiếp:**
- Double-click file `frontend/products.html`

## ✅ KIỂM TRA HOẠT ĐỘNG

### Test Backend API
Mở browser và truy cập:
```
http://localhost:3000
http://localhost:3000/api/products
http://localhost:3000/api/products/search?q=jean
```

### Test Frontend Search
1. Mở trang products (Live Server)
2. Nhập "jean" vào thanh tìm kiếm
3. Nhấn "Tìm kiếm" hoặc Enter
4. Xem kết quả hiển thị

## 🔍 DEMO TÌM KIẾM

Thử các từ khóa sau:
- `jean` → Tìm quần jean
- `áo` → Tìm các loại áo  
- `iphone` → Tìm điện thoại
- `macbook` → Tìm laptop
- `hoodie` → Tìm áo hoodie
- `sony` → Tìm tai nghe Sony

Thử các filter:
- Chọn "Quần áo" trong dropdown Danh mục
- Chọn "Dưới 500k" trong dropdown Giá
- Chọn "Giá thấp đến cao" trong Sắp xếp

## 🛠️ TROUBLESHOOTING

### Lỗi: "Cannot connect to database"
- Kiểm tra MySQL đang chạy
- Kiểm tra password trong file `backend/.env`
- Thử: `mysql -u root -p` để test kết nối

### Lỗi: "Port 3000 already in use"
- Có process khác đang dùng port 3000
- Kill process: `netstat -ano | findstr :3000` rồi `taskkill /PID <PID> /F`
- Hoặc đổi PORT trong `.env` thành 3001

### Lỗi: "fetch failed" trong frontend
- Backend chưa chạy → Chạy `npm start` trong thư mục backend
- Kiểm tra URL API trong `products.js` là `http://localhost:3000`

### Trang products.html trống
- Mở Console trong browser (F12)
- Xem lỗi gì (nếu có)
- Kiểm tra backend đang chạy
- Kiểm tra kết nối API

## 📱 LIÊN HỆ HỖ TRỢ

Nếu gặp vấn đề:
1. Check console.log trong browser (F12)
2. Check terminal backend có lỗi không
3. Đọc file `SETUP_COMPLETE.md` để biết thêm chi tiết
