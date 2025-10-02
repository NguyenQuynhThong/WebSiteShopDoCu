# SecondShop - Hệ Thống Components

## 📋 Tổng quan

Dự án đã được tái cấu trúc để tách các thành phần UI có thể tái sử dụng (reusable components) nhằm:
- ✅ Giảm code trùng lặp
- ✅ Dễ dàng bảo trì và cập nhật
- ✅ Thống nhất giao diện trên toàn bộ website
- ✅ Tăng tốc độ phát triển

## 🗂️ Cấu trúc thư mục

```
frontend/
├── components/           # Thư mục chứa các components tái sử dụng
│   ├── header.html      # Header với logo, search bar, user navigation
│   ├── navigation.html  # Main navigation menu
│   ├── footer.html      # Footer với thông tin liên hệ
│   ├── chatbot.html     # Chatbot widget
│   └── loader.js        # Script để load các components
├── index.html           # Trang chủ
├── products.html        # Trang sản phẩm
├── cart.html            # Trang giỏ hàng
├── contact.html         # Trang liên hệ
├── login.html           # Trang đăng nhập
├── register.html        # Trang đăng ký
├── admin.html           # Trang quản trị
├── style.css            # CSS chung
├── main.js              # JavaScript chính
└── counter.js           # Logic cho giỏ hàng
```

## 🧩 Các Components

### 1. Header (`components/header.html`)
**Chức năng:**
- Logo và tagline
- Thanh tìm kiếm
- Menu user (Đăng nhập, Đăng ký, Giỏ hàng)
- Hiển thị số lượng sản phẩm trong giỏ hàng

**Sử dụng:**
```html
<div id="header-placeholder"></div>
```

### 2. Navigation (`components/navigation.html`)
**Chức năng:**
- Menu điều hướng chính
- Tự động active class theo trang hiện tại
- Links: Trang chủ, Sản Phẩm, Liên hệ

**Sử dụng:**
```html
<div id="nav-placeholder"></div>
```

### 3. Footer (`components/footer.html`)
**Chức năng:**
- Thông tin công ty
- Liên kết nhanh
- Thông tin liên hệ
- Copyright notice

**Sử dụng:**
```html
<div id="footer-placeholder"></div>
```

### 4. Chatbot (`components/chatbot.html`)
**Chức năng:**
- Widget chat hỗ trợ khách hàng
- Toggle mở/đóng
- Gửi và nhận tin nhắn
- Tự động phản hồi

**Sử dụng:**
```html
<div id="chatbot-placeholder"></div>
```

## 🚀 Cách sử dụng Components

### Bước 1: Thêm placeholders vào HTML
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trang của bạn</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Header Component -->
    <div id="header-placeholder"></div>

    <!-- Navigation Component -->
    <div id="nav-placeholder"></div>

    <!-- Nội dung trang của bạn -->
    <section>
        <div class="container">
            <h1>Nội dung</h1>
        </div>
    </section>

    <!-- Footer Component -->
    <div id="footer-placeholder"></div>

    <!-- Chatbot Component -->
    <div id="chatbot-placeholder"></div>

    <!-- Load Components Script -->
    <script src="components/loader.js"></script>
</body>
</html>
```

### Bước 2: Components tự động load
Script `loader.js` sẽ tự động:
1. Load tất cả components vào các placeholder
2. Set active navigation dựa trên trang hiện tại
3. Cập nhật số lượng giỏ hàng từ localStorage
4. Khởi tạo chatbot functionality

## 📝 Component Loader API

### Các hàm chính trong `loader.js`:

#### `loadComponent(elementId, componentPath)`
Load một component vào element cụ thể
```javascript
await loadComponent('header-placeholder', 'components/header.html');
```

#### `loadCommonComponents()`
Load tất cả common components cùng lúc
```javascript
await loadCommonComponents();
```

#### `setActiveNavigation()`
Set active class cho navigation item dựa trên trang hiện tại

#### `updateCartCount()`
Cập nhật số lượng giỏ hàng từ localStorage
```javascript
// Gọi sau khi thêm/xóa sản phẩm
ComponentLoader.updateCartCount();
```

#### `initializeChatbot()`
Khởi tạo chatbot với các event listeners

#### `initializeSearch()`
Khởi tạo chức năng tìm kiếm

## 🔧 Tùy chỉnh Components

### Thay đổi nội dung
Sửa trực tiếp file component trong thư mục `components/`:
```
components/header.html    → Sửa logo, tagline
components/navigation.html → Thêm/bớt menu items
components/footer.html    → Cập nhật thông tin liên hệ
components/chatbot.html   → Thay đổi UI chatbot
```

### Thay đổi styling
CSS cho components nằm trong `style.css` với các classes:
- `.header` - Header styles
- `.main-nav` - Navigation styles
- `.footer` - Footer styles
- `.chatbot-widget` - Chatbot styles

### Thêm functionality mới
Chỉnh sửa `components/loader.js` để thêm:
- Event listeners mới
- API calls
- Custom behaviors

## 📊 Lợi ích của Components

### Trước khi áp dụng:
```
❌ 500+ dòng HTML trùng lặp cho header/footer
❌ Phải sửa 5 files khi thay đổi menu
❌ Khó maintain và debug
❌ Code không DRY (Don't Repeat Yourself)
```

### Sau khi áp dụng:
```
✅ 1 file component cho header/footer
✅ Chỉ sửa 1 file để cập nhật toàn bộ site
✅ Dễ maintain và scale
✅ Code DRY và clean
✅ Tải nhanh hơn với caching
```

## 🎯 Best Practices

1. **Luôn include loader.js:**
   ```html
   <script src="components/loader.js"></script>
   ```

2. **Đặt placeholders đúng vị trí:**
   - Header: Đầu `<body>`
   - Navigation: Sau header
   - Footer: Trước `</body>`
   - Chatbot: Cuối cùng trước scripts

3. **Maintain structure:**
   - Không thay đổi ID của placeholders
   - Giữ cấu trúc HTML trong components
   - Update CSS nếu thay đổi classes

4. **Testing:**
   - Test tất cả trang sau khi sửa components
   - Kiểm tra active navigation
   - Verify chatbot functionality

## 🐛 Troubleshooting

### Component không hiển thị:
```javascript
// Check console để xem lỗi
// Đảm bảo đường dẫn đúng
// Verify file tồn tại trong components/
```

### Navigation không active:
```javascript
// Kiểm tra ID trong navigation.html
// Đảm bảo tên file khớp với logic trong setActiveNavigation()
```

### Chatbot không hoạt động:
```javascript
// Verify chatbot-placeholder loaded
// Check initializeChatbot() trong loader.js
// Xem console errors
```

## 📚 Tài liệu tham khảo

- **HTML Components**: `frontend/components/`
- **Loader Script**: `frontend/components/loader.js`
- **Main Styles**: `frontend/style.css`
- **Example Pages**: `index.html`, `products.html`, `cart.html`, `contact.html`

## 🚀 Phát triển tiếp

### Có thể thêm components mới:
- Product card template
- Review/rating component
- Newsletter signup
- Social media links
- Breadcrumb navigation
- Filter sidebar
- Modal dialogs

### Nâng cấp tiếp theo:
- [ ] Thêm template engine (Handlebars, EJS)
- [ ] Implement service worker cho offline
- [ ] Add loading states
- [ ] Error handling improvement
- [ ] SEO optimization
- [ ] Performance monitoring

---

**Được tạo bởi:** GitHub Copilot  
**Ngày cập nhật:** 2 tháng 10, 2025  
**Version:** 1.0.0
