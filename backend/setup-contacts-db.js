// =============================================
// SCRIPT TẠO BẢNG CONTACTS
// LAG VINTAGE SHOP
// =============================================
// Script này sẽ tạo bảng contacts trong database hiện tại
// =============================================

const { pool } = require('./config/database');

async function setupContactsTable() {
    try {
        console.log('='.repeat(60));
        console.log('🔧 THIẾT LẬP BẢNG CONTACTS');
        console.log('='.repeat(60));
        
        // Kiểm tra xem bảng contacts đã tồn tại chưa
        console.log('\n1. Kiểm tra bảng contacts...');
        const [tables] = await pool.query(
            "SHOW TABLES LIKE 'contacts'"
        );
        
        if (tables.length > 0) {
            console.log('   ⚠️  Bảng contacts đã tồn tại!');
            console.log('   Bạn có muốn xóa và tạo lại? (y/n)');
            
            // Trong môi trường production, nên hỏi xác nhận
            // Ở đây tôi sẽ bỏ qua bước này và chỉ thông báo
            console.log('   → Bỏ qua việc tạo lại bảng.');
            console.log('   → Nếu muốn tạo lại, hãy chạy: DROP TABLE contacts; rồi chạy lại script này.');
            
            // Hiển thị cấu trúc bảng hiện tại
            const [structure] = await pool.query('DESCRIBE contacts');
            console.log('\n   Cấu trúc bảng hiện tại:');
            structure.forEach(col => {
                console.log(`     - ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(NULL)' : '(NOT NULL)'}`);
            });
            
            // Đếm số lượng contacts
            const [count] = await pool.query('SELECT COUNT(*) as total FROM contacts');
            console.log(`\n   📊 Số lượng liên hệ hiện tại: ${count[0].total}`);
            
        } else {
            console.log('   ℹ️  Bảng contacts chưa tồn tại. Đang tạo mới...');
            
            // Tạo bảng contacts
            await pool.query(`
                CREATE TABLE contacts (
                    contact_id INT PRIMARY KEY AUTO_INCREMENT,
                    first_name VARCHAR(100) NOT NULL COMMENT 'Họ',
                    last_name VARCHAR(100) NOT NULL COMMENT 'Tên',
                    email VARCHAR(255) NOT NULL COMMENT 'Email liên hệ',
                    phone VARCHAR(20) COMMENT 'Số điện thoại',
                    
                    subject VARCHAR(100) NOT NULL COMMENT 'Chủ đề: general, order, product, shipping, return, complaint, other',
                    message TEXT NOT NULL COMMENT 'Nội dung tin nhắn',
                    
                    subscribe_newsletter BOOLEAN DEFAULT FALSE COMMENT 'Đăng ký nhận tin',
                    
                    is_read BOOLEAN DEFAULT FALSE COMMENT 'Admin đã đọc chưa',
                    is_replied BOOLEAN DEFAULT FALSE COMMENT 'Admin đã trả lời chưa',
                    
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày gửi',
                    
                    INDEX idx_email (email),
                    INDEX idx_is_read (is_read),
                    INDEX idx_created (created_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tin nhắn liên hệ từ khách hàng'
            `);
            
            console.log('   ✅ Đã tạo bảng contacts thành công!');
            
            // Thêm dữ liệu mẫu
            console.log('\n2. Thêm dữ liệu mẫu...');
            await pool.query(`
                INSERT INTO contacts (first_name, last_name, email, phone, subject, message, subscribe_newsletter, is_read, is_replied) VALUES
                ('Nguyễn', 'Văn A', 'nguyenvana@email.com', '0123456789', 'return', 'Tôi muốn hỏi về chính sách đổi trả sản phẩm. Xin cho tôi biết chi tiết.', TRUE, FALSE, FALSE),
                ('Trần', 'Thị B', 'tranthib@email.com', '0987654321', 'order', 'Đơn hàng #12345 của tôi đã 5 ngày mà vẫn chưa nhận được. Vui lòng kiểm tra giúp tôi.', FALSE, TRUE, FALSE),
                ('Lê', 'Văn C', 'levanc@email.com', '0912345678', 'product', 'Tôi muốn biết thêm thông tin về áo khoác vintage mã SP-001. Còn hàng không?', TRUE, TRUE, TRUE),
                ('Phạm', 'Thị D', 'phamthid@email.com', '0898765432', 'general', 'Website rất đẹp và sản phẩm chất lượng. Cảm ơn shop!', FALSE, TRUE, TRUE)
            `);
            
            console.log('   ✅ Đã thêm 4 dữ liệu mẫu!');
        }
        
        // Hiển thị dữ liệu contacts
        console.log('\n3. Dữ liệu contacts hiện tại:');
        const [contacts] = await pool.query(
            'SELECT contact_id, first_name, last_name, email, subject, is_read, is_replied, created_at FROM contacts ORDER BY created_at DESC LIMIT 10'
        );
        
        if (contacts.length === 0) {
            console.log('   (Chưa có dữ liệu)');
        } else {
            console.log('');
            contacts.forEach(contact => {
                const fullName = `${contact.first_name} ${contact.last_name}`;
                const readStatus = contact.is_read ? '✓ Đã đọc' : '✗ Chưa đọc';
                const replyStatus = contact.is_replied ? '✓ Đã trả lời' : '✗ Chưa trả lời';
                console.log(`   📧 [${contact.contact_id}] ${fullName} (${contact.email})`);
                console.log(`      Chủ đề: ${contact.subject} | ${readStatus} | ${replyStatus}`);
                console.log(`      Thời gian: ${contact.created_at}`);
                console.log('');
            });
        }
        
        console.log('='.repeat(60));
        console.log('✅ HOÀN TẤT THIẾT LẬP BẢNG CONTACTS!');
        console.log('='.repeat(60));
        console.log('\n📝 Bạn có thể:');
        console.log('   - Truy cập trang liên hệ: http://localhost:3000/contact.html');
        console.log('   - Quản lý liên hệ trong Admin: http://localhost:3000/admin.html');
        console.log('   - API endpoint: http://localhost:3000/api/contacts');
        console.log('');
        
    } catch (error) {
        console.error('❌ Lỗi khi thiết lập bảng contacts:', error.message);
        console.error('Chi tiết:', error);
    } finally {
        process.exit(0);
    }
}

// Chạy script
setupContactsTable();
