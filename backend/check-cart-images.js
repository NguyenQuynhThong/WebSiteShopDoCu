// Kiểm tra hình ảnh trong giỏ hàng
const { pool } = require('./config/database');

async function checkCartImages() {
    try {
        console.log('='.repeat(60));
        console.log('KIỂM TRA HÌNH ẢNH TRONG GIỎ HÀNG');
        console.log('='.repeat(60));
        
        // Lấy dữ liệu giỏ hàng
        const [cartItems] = await pool.query(`
            SELECT 
                c.cart_id,
                c.product_id,
                c.quantity,
                p.product_name,
                p.image_url,
                p.price,
                CASE 
                    WHEN p.image_url LIKE 'http%' THEN p.image_url
                    WHEN p.image_url LIKE '/images/%' THEN p.image_url
                    ELSE CONCAT('/images/', p.image_url)
                END as processed_image
            FROM cart c
            JOIN products p ON c.product_id = p.product_id
            LIMIT 10
        `);
        
        console.log('\nDữ liệu giỏ hàng (10 items đầu):');
        console.log('='.repeat(60));
        
        cartItems.forEach((item, index) => {
            console.log(`\n${index + 1}. ${item.product_name}`);
            console.log(`   Cart ID: ${item.cart_id}`);
            console.log(`   Product ID: ${item.product_id}`);
            console.log(`   Quantity: ${item.quantity}`);
            console.log(`   Price: ${item.price}₫`);
            console.log(`   Image URL (raw): "${item.image_url}"`);
            console.log(`   Image URL (processed): "${item.processed_image}"`);
        });
        
        console.log('\n' + '='.repeat(60));
        
        // Kiểm tra các loại image_url
        console.log('\nPhân tích image_url:');
        const httpImages = cartItems.filter(item => item.image_url?.startsWith('http'));
        const pathImages = cartItems.filter(item => item.image_url?.startsWith('/images/'));
        const fileImages = cartItems.filter(item => item.image_url && !item.image_url.startsWith('http') && !item.image_url.startsWith('/'));
        const nullImages = cartItems.filter(item => !item.image_url);
        
        console.log(`  - HTTP/HTTPS URLs: ${httpImages.length}`);
        console.log(`  - /images/ paths: ${pathImages.length}`);
        console.log(`  - Filename only: ${fileImages.length}`);
        console.log(`  - NULL/Empty: ${nullImages.length}`);
        
        if (nullImages.length > 0) {
            console.log('\n⚠️ Sản phẩm không có hình ảnh:');
            nullImages.forEach(item => {
                console.log(`   - ${item.product_name} (ID: ${item.product_id})`);
            });
        }
        
        console.log('\n' + '='.repeat(60));
        
    } catch (error) {
        console.error('Lỗi:', error.message);
    } finally {
        process.exit(0);
    }
}

checkCartImages();
