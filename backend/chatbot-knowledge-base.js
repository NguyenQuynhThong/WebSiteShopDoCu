// =============================================
// CHATBOT KNOWLEDGE BASE - LAG VINTAGE SHOP
// =============================================
// File này chứa toàn bộ kiến thức về dự án để chatbot có thể trả lời
// =============================================

const PROJECT_KNOWLEDGE = {
    // ===== THÔNG TIN CƠ BẢN =====
    shopInfo: {
        name: "LAG Vintage Shop",
        description: "Cửa hàng chuyên bán thời trang vintage và công nghệ cũ chất lượng cao",
        location: "Việt Nam",
        shipping: "Giao hàng toàn quốc",
        website: "http://localhost:3000",
        features: [
            "Đặt hàng online 24/7",
            "Thanh toán COD hoặc chuyển khoản",
            "Hỗ trợ trả góp 0%",
            "Đổi trả trong 7 ngày",
            "Bảo hành sản phẩm công nghệ",
            "Tư vấn styling miễn phí"
        ]
    },

    // ===== DANH MỤC SẢN PHẨM =====
    categories: {
        clothing: {
            name: "Thời trang Vintage",
            description: "Quần áo cũ second-hand chất lượng cao",
            products: [
                "Áo khoác vintage (bomber, blazer, jacket)",
                "Áo sơ mi vintage (họa tiết retro, caro)",
                "Quần jeans vintage (wash cổ điển)",
                "Váy vintage (maxi, hoa)",
                "Áo len, cardigan vintage",
                "Quần short vintage"
            ],
            sizes: ["S", "M", "L", "XL", "XXL"],
            condition: "Tình trạng 70-95%, được làm sạch và kiểm định kỹ"
        },
        tech: {
            name: "Công nghệ Cũ",
            description: "Thiết bị điện tử second-hand còn tốt",
            products: [
                "Điện thoại: iPhone (13, 14), Samsung, Xiaomi",
                "Laptop: MacBook, Lenovo, Dell",
                "Tai nghe: Sony, AirPods",
                "Phụ kiện: Ốp lưng, cáp sạc, sạc dự phòng"
            ],
            warranty: "Bảo hành 1-3 tháng tùy sản phẩm",
            condition: "Kiểm tra kỹ, đảm bảo hoạt động tốt"
        }
    },

    // ===== CƠ SỞ DỮ LIỆU =====
    database: {
        name: "lag_vintage_shop",
        tables: {
            users: {
                description: "Quản lý tài khoản người dùng",
                columns: ["user_id", "email", "password", "full_name", "phone", "address", "role", "status", "created_at", "last_login"],
                roles: ["customer", "admin"],
                total: "~6 users"
            },
            products: {
                description: "Quản lý sản phẩm",
                columns: ["product_id", "product_name", "price", "old_price", "category", "description", "image_url", "stock_quantity", "condition_percentage", "size", "badge", "created_at"],
                categories: ["clothing", "tech"],
                badges: ["Hot", "New", "Sale"],
                total: "72 sản phẩm"
            },
            cart: {
                description: "Giỏ hàng của khách (guest session hoặc user đã đăng nhập)",
                columns: ["cart_id", "user_id", "session_id", "product_id", "quantity", "added_at", "updated_at"],
                note: "Hỗ trợ cả guest và user đăng nhập"
            },
            orders: {
                description: "Quản lý đơn hàng",
                columns: ["order_id", "user_id", "full_name", "phone", "address", "email", "total_amount", "payment_method", "status", "note", "created_at", "updated_at"],
                statuses: ["pending", "confirmed", "shipping", "completed", "cancelled"]
            },
            order_items: {
                description: "Chi tiết sản phẩm trong đơn hàng",
                columns: ["item_id", "order_id", "product_id", "product_name", "product_image", "price", "quantity", "item_total"]
            },
            payments: {
                description: "Quản lý thanh toán",
                columns: ["payment_id", "order_id", "payment_method", "amount", "status", "transaction_id", "qr_code", "paid_at", "created_at"],
                methods: ["cod", "bank_transfer"],
                statuses: ["pending", "completed", "failed"]
            },
            contacts: {
                description: "Tin nhắn liên hệ từ khách hàng",
                columns: ["contact_id", "first_name", "last_name", "email", "phone", "subject", "message", "subscribe_newsletter", "is_read", "is_replied", "created_at"],
                subjects: ["general", "order", "product", "shipping", "return", "complaint", "other"]
            }
        }
    },

    // ===== API ENDPOINTS =====
    api: {
        base_url: "http://localhost:3000/api",
        endpoints: {
            // Products API
            products: {
                "GET /products": "Lấy danh sách sản phẩm (có lọc, tìm kiếm, phân trang)",
                "GET /products/:id": "Chi tiết sản phẩm",
                "POST /products": "Tạo sản phẩm mới (Admin)",
                "PUT /products/:id": "Cập nhật sản phẩm (Admin)",
                "DELETE /products/:id": "Xóa sản phẩm (Admin)"
            },
            // Users API
            users: {
                "POST /users/register": "Đăng ký tài khoản",
                "POST /users/login": "Đăng nhập",
                "GET /users/profile": "Xem profile (cần token)",
                "PUT /users/profile": "Cập nhật profile",
                "GET /users/customers": "Danh sách khách hàng (Admin)"
            },
            // Cart API
            cart: {
                "GET /cart": "Xem giỏ hàng (cần auth)",
                "POST /cart/add": "Thêm vào giỏ",
                "PUT /cart/update/:cartId": "Cập nhật số lượng",
                "DELETE /cart/remove/:cartId": "Xóa khỏi giỏ",
                "DELETE /cart/clear": "Xóa toàn bộ giỏ",
                "POST /cart/merge": "Gộp giỏ guest vào user"
            },
            // Orders API
            orders: {
                "POST /orders/create": "Tạo đơn hàng",
                "GET /orders": "Danh sách đơn hàng (Admin)",
                "GET /orders/my-orders": "Đơn hàng của tôi",
                "GET /orders/:id": "Chi tiết đơn hàng",
                "PUT /orders/:id/status": "Cập nhật trạng thái (Admin)"
            },
            // Payments API
            payments: {
                "GET /payments/qr/:orderId": "Lấy QR code thanh toán",
                "GET /payments/status/:orderId": "Kiểm tra trạng thái thanh toán",
                "POST /payments/confirm/:orderId": "Xác nhận thanh toán"
            },
            // Contacts API
            contacts: {
                "POST /contacts": "Gửi tin nhắn liên hệ",
                "GET /contacts": "Danh sách liên hệ (Admin)",
                "PUT /contacts/:id/read": "Đánh dấu đã đọc",
                "PUT /contacts/:id/replied": "Đánh dấu đã trả lời",
                "DELETE /contacts/:id": "Xóa tin nhắn"
            },
            // Chatbot API
            chatbot: {
                "POST /chatbot/chat": "Gửi tin nhắn chat",
                "GET /chatbot/suggestions": "Lấy gợi ý câu hỏi",
                "DELETE /chatbot/history/:sessionId": "Xóa lịch sử chat"
            }
        }
    },

    // ===== TÍNH NĂNG CHÍNH =====
    features: {
        frontend: {
            pages: [
                "index.html - Trang chủ",
                "products.html - Danh sách sản phẩm (lọc, tìm kiếm)",
                "product-detail.html - Chi tiết sản phẩm",
                "cart.html - Giỏ hàng",
                "checkout.html - Thanh toán",
                "payment.html - Trang thanh toán QR",
                "my-orders.html - Đơn hàng của tôi",
                "order-detail.html - Chi tiết đơn hàng",
                "contact.html - Liên hệ",
                "login.html - Đăng nhập",
                "register.html - Đăng ký",
                "admin.html - Quản trị viên (CRUD products, users, orders, contacts)"
            ],
            components: [
                "header.html - Header với search, cart, user menu",
                "navigation.html - Menu điều hướng",
                "footer.html - Footer",
                "chatbot.html - Chatbot AI (Gemini 2.0 Flash)"
            ]
        },
        backend: {
            tech_stack: [
                "Node.js + Express.js",
                "MySQL2 (Promise-based)",
                "JWT Authentication",
                "Bcrypt (mã hóa password)",
                "Google Gemini AI 2.0 Flash",
                "CORS enabled",
                "dotenv (environment variables)"
            ],
            middleware: [
                "requireAuth - Kiểm tra token JWT",
                "verifyToken - Xác thực token",
                "isAdmin - Kiểm tra quyền admin"
            ]
        },
        admin: {
            functions: [
                "CRUD Products - Quản lý sản phẩm",
                "CRUD Orders - Quản lý đơn hàng",
                "View Customers - Xem danh sách khách hàng",
                "View Contacts - Xem & trả lời liên hệ",
                "Statistics - Thống kê doanh thu, đơn hàng"
            ],
            credentials: {
                email: "admin@gmail.com",
                password: "123456",
                note: "Mật khẩu đã được mã hóa bcrypt trong database"
            }
        },
        authentication: {
            method: "JWT (JSON Web Token)",
            expiry: "7 ngày",
            storage: "localStorage (token key: 'token')",
            flow: [
                "1. User login → Backend trả về token",
                "2. Frontend lưu token vào localStorage",
                "3. Mỗi request gửi token qua header: Authorization: Bearer <token>",
                "4. Backend verify token → Trả về user info"
            ]
        },
        payment: {
            methods: [
                "COD (Cash on Delivery) - Thanh toán khi nhận hàng",
                "Bank Transfer - Chuyển khoản ngân hàng qua QR code"
            ],
            bank_info: {
                bank: "VietcomBank",
                account_number: "1234567890",
                account_name: "LAG VINTAGE SHOP",
                note: "QR code tự động tạo với nội dung: ORDER-{orderId}"
            }
        }
    },

    // ===== QUY TRÌNH NGHIỆP VỤ =====
    workflows: {
        shopping: [
            "1. Khách vào trang products.html → Duyệt, lọc, tìm kiếm sản phẩm",
            "2. Click sản phẩm → product-detail.html → Thêm vào giỏ",
            "3. Vào cart.html → Xem giỏ hàng, cập nhật số lượng",
            "4. Checkout → Điền thông tin giao hàng",
            "5. Chọn phương thức thanh toán (COD/Bank Transfer)",
            "6. Tạo đơn hàng → Nếu Bank Transfer → Hiển thị QR code",
            "7. Xem đơn hàng tại my-orders.html"
        ],
        admin_order_management: [
            "1. Admin login → admin.html",
            "2. Tab 'Quản lý đơn hàng'",
            "3. Xem danh sách → Click xem chi tiết",
            "4. Cập nhật trạng thái: pending → confirmed → shipping → completed",
            "5. Có thể hủy đơn (cancelled)"
        ],
        contact: [
            "1. Khách vào contact.html → Điền form liên hệ",
            "2. Submit → Lưu vào database",
            "3. Admin vào admin.html → Tab 'Liên hệ'",
            "4. Xem tin nhắn → Đánh dấu đã đọc/đã trả lời",
            "5. Admin trả lời qua email/phone"
        ]
    },

    // ===== CÂU HỎI THƯỜNG GẶP =====
    faq: {
        general: {
            "Shop ở đâu?": "LAG Vintage Shop hoạt động online tại Việt Nam, giao hàng toàn quốc.",
            "Có shop offline không?": "Hiện tại shop chỉ bán online qua website. Bạn có thể đặt hàng 24/7.",
            "Giao hàng mất bao lâu?": "Thường 2-5 ngày tùy địa điểm. Nội thành nhanh hơn."
        },
        products: {
            "Sản phẩm có mới không?": "Tất cả là đồ second-hand (đã qua sử dụng) nhưng chất lượng cao, được kiểm định kỹ.",
            "Tình trạng sản phẩm thế nào?": "Mỗi sản phẩm có % tình trạng (70-95%). Xem chi tiết ở từng sản phẩm.",
            "Có bảo hành không?": "Sản phẩm công nghệ có bảo hành 1-3 tháng. Quần áo không bảo hành nhưng đổi trả trong 7 ngày."
        },
        payment: {
            "Thanh toán thế nào?": "Có 2 cách: COD (nhận hàng trả tiền) hoặc chuyển khoản qua QR code.",
            "Có trả góp không?": "Có hỗ trợ trả góp 0% qua thẻ tín dụng.",
            "QR code ở đâu?": "Sau khi tạo đơn hàng chọn chuyển khoản, hệ thống hiển thị QR code."
        },
        shipping: {
            "Phí ship bao nhiêu?": "Phí ship tính theo địa điểm, thường 15-35k. Đơn trên 500k freeship.",
            "Có theo dõi đơn hàng không?": "Có, vào my-orders.html hoặc nhập mã đơn hàng để tra cứu.",
            "Đổi trả thế nào?": "Đổi trả trong 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả."
        },
        account: {
            "Đăng ký tài khoản như thế nào?": "Click 'Đăng ký' ở góc phải header, điền thông tin.",
            "Quên mật khẩu?": "Liên hệ admin qua form contact hoặc hotline để reset.",
            "Guest có mua được không?": "Có thể mua với guest session nhưng không theo dõi được đơn hàng. Nên đăng ký."
        }
    },

    // ===== CÔNG NGHỆ KỸ THUẬT =====
    technical: {
        stack: {
            backend: "Node.js v22.14.0 + Express.js",
            database: "MySQL 8.0 (charset: utf8mb4)",
            frontend: "Vanilla JavaScript (ES6+), HTML5, CSS3",
            ai: "Google Gemini 2.0 Flash (fallback: 1.5 Flash)",
            auth: "JWT (jsonwebtoken package)",
            password: "Bcrypt v6.0.0"
        },
        env_variables: [
            "PORT=3000",
            "DB_HOST=localhost",
            "DB_USER=root",
            "DB_PASSWORD=TVU@842004",
            "DB_NAME=lag_vintage_shop",
            "DB_PORT=3306",
            "JWT_SECRET=(random key)",
            "GEMINI_API_KEY=(your API key)"
        ],
        commands: {
            start_server: "cd backend && node server.js",
            install: "cd backend && npm install",
            check_db: "node backend/check-db.js",
            create_admin: "node backend/create-admin.js"
        }
    },

    // ===== PROMPTS TRẢ LỜI =====
    responseTemplates: {
        greeting: "Xin chào! Tôi là trợ lý ảo của LAG Vintage Shop 👋 Tôi có thể giúp gì cho bạn?",
        product_inquiry: "Chúng tôi có {category} với nhiều lựa chọn. Bạn đang tìm kiểu nào hoặc có ngân sách bao nhiêu?",
        technical_support: "Để được hỗ trợ kỹ thuật chi tiết, vui lòng liên hệ admin qua form liên hệ hoặc email.",
        order_status: "Bạn có thể tra cứu đơn hàng tại trang 'Đơn hàng của tôi' sau khi đăng nhập.",
        price_inquiry: "Giá sản phẩm cập nhật liên tục. Vui lòng xem chi tiết tại trang sản phẩm.",
        not_sure: "Câu hỏi này hơi khó 😅 Để được hỗ trợ tốt nhất, bạn có thể liên hệ admin qua form liên hệ hoặc gọi hotline nhé!"
    }
};

module.exports = { PROJECT_KNOWLEDGE };
