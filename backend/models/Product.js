const { pool: db } = require('../config/database');

class Product {
    // Lấy tất cả sản phẩm với phân trang
    static async getAll(page = 1, limit = 20, category = null) {
        try {
            // Set charset UTF-8
            await db.query("SET NAMES 'utf8mb4'");
            
            // Convert to integers to avoid SQL syntax errors
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 20;
            const offset = (pageNum - 1) * limitNum;

            let query = `
                SELECT
                    p.product_id as id,
                    p.product_name as name,
                    p.description,
                    c.category_name as category,
                    CAST(p.price AS DECIMAL(10,2)) as price,
                    NULL as old_price,
                    CASE 
                        WHEN p.image_url LIKE 'http%' THEN p.image_url
                        WHEN p.image_url LIKE '/images/%' THEN p.image_url
                        WHEN p.image_url LIKE '../backend/images/%' THEN CONCAT('/images/', REPLACE(p.image_url, '../backend/images/', ''))
                        ELSE CONCAT('/images/', p.image_url)
                    END as image,
                    p.stock_quantity as stock,
                    p.condition_status as condition_percentage,
                    p.size_available as size,
                    NULL as badge,
                    p.created_at
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE 1=1
            `;
            const params = [];

            // Map frontend category names to database category names
            const categoryMapping = {
                'clothing': ['Áo Khoác', 'Áo Sơ Mi', 'Quần', 'Váy'],
                'tech': ['Điện Thoại', 'Laptop', 'Tai Nghe', 'Phụ Kiện']
            };

            if (category && category !== 'all') {
                if (categoryMapping[category]) {
                    const categoryNames = categoryMapping[category];
                    const placeholders = categoryNames.map(() => '?').join(',');
                    query += ` AND c.category_name IN (${placeholders})`;
                    params.push(...categoryNames);
                }
            }

            query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
            params.push(limitNum, offset);

            const [rows] = await db.query(query, params);

            // Đếm tổng số sản phẩm
            let countQuery = `
                SELECT COUNT(*) as total
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE 1=1
            `;
            const countParams = [];

            if (category && category !== 'all' && categoryMapping[category]) {
                const categoryNames = categoryMapping[category];
                const placeholders = categoryNames.map(() => '?').join(',');
                countQuery += ` AND c.category_name IN (${placeholders})`;
                countParams.push(...categoryNames);
            }

            const [countResult] = await db.query(countQuery, countParams);

            return {
                success: true,
                data: rows,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: countResult[0].total,
                    totalPages: Math.ceil(countResult[0].total / limitNum)
                }
            };
        } catch (error) {
            console.error('Error in getAll:', error);
            return { success: false, message: error.message };
        }
    }

    // Tìm kiếm sản phẩm
    static async search(keyword, category = null, priceRange = null, page = 1, limit = 20) {
        try {
            // Set charset UTF-8
            await db.query("SET NAMES 'utf8mb4'");
            
            // Convert to integers to avoid SQL syntax errors
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 20;
            const offset = (pageNum - 1) * limitNum;
            
            let query = `
                SELECT
                    p.product_id as id,
                    p.product_name as name,
                    p.description,
                    c.category_name as category,
                    CAST(p.price AS DECIMAL(10,2)) as price,
                    NULL as old_price,
                    CASE 
                        WHEN p.image_url LIKE 'http%' THEN p.image_url
                        WHEN p.image_url LIKE '/images/%' THEN p.image_url
                        WHEN p.image_url LIKE '../backend/images/%' THEN CONCAT('/images/', REPLACE(p.image_url, '../backend/images/', ''))
                        ELSE CONCAT('/images/', p.image_url)
                    END as image,
                    p.stock_quantity as stock,
                    p.condition_status as condition_percentage,
                    p.size_available as size,
                    NULL as badge,
                    p.created_at
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE (p.product_name LIKE ? OR p.description LIKE ? OR c.category_name LIKE ?)
            `;
            const searchTerm = `%${keyword}%`;
            const params = [searchTerm, searchTerm, searchTerm];

            // Filter theo category
            if (category && category !== 'all') {
                const categoryMapping = {
                    'clothing': ['Áo Khoác', 'Áo Sơ Mi', 'Quần', 'Váy'],
                    'tech': ['Điện Thoại', 'Laptop', 'Tai Nghe', 'Phụ Kiện']
                };

                if (categoryMapping[category]) {
                    const categoryNames = categoryMapping[category];
                    const placeholders = categoryNames.map(() => '?').join(',');
                    query += ` AND c.category_name IN (${placeholders})`;
                    params.push(...categoryNames);
                }
            }

            // Filter theo price range
            if (priceRange && priceRange !== 'all') {
                if (priceRange === '0-500k') {
                    query += ' AND price < 500000';
                } else if (priceRange === '500k-2m') {
                    query += ' AND price >= 500000 AND price < 2000000';
                } else if (priceRange === '2m-5m') {
                    query += ' AND price >= 2000000 AND price < 5000000';
                } else if (priceRange === '5m+') {
                    query += ' AND price >= 5000000';
                }
            }

            query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
            params.push(limitNum, offset);

            const [rows] = await db.query(query, params);

            // Đếm tổng kết quả
            let countQuery = `
                SELECT COUNT(*) as total
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE (p.product_name LIKE ? OR p.description LIKE ? OR c.category_name LIKE ?)
            `;
            const countParams = [searchTerm, searchTerm, searchTerm];

            if (category && category !== 'all') {
                const categoryMapping = {
                    'clothing': ['Áo Khoác', 'Áo Sơ Mi', 'Quần', 'Váy'],
                    'tech': ['Điện Thoại', 'Laptop', 'Tai Nghe', 'Phụ Kiện']
                };

                if (categoryMapping[category]) {
                    const categoryNames = categoryMapping[category];
                    const placeholders = categoryNames.map(() => '?').join(',');
                    countQuery += ` AND c.category_name IN (${placeholders})`;
                    countParams.push(...categoryNames);
                }
            }

            if (priceRange && priceRange !== 'all') {
                if (priceRange === '0-500k') {
                    countQuery += ' AND price < 500000';
                } else if (priceRange === '500k-2m') {
                    countQuery += ' AND price >= 500000 AND price < 2000000';
                } else if (priceRange === '2m-5m') {
                    countQuery += ' AND price >= 2000000 AND price < 5000000';
                } else if (priceRange === '5m+') {
                    countQuery += ' AND price >= 5000000';
                }
            }

            const [countResult] = await db.query(countQuery, countParams);

            return {
                success: true,
                data: rows,
                keyword: keyword,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: countResult[0].total,
                    totalPages: Math.ceil(countResult[0].total / limitNum)
                }
            };
        } catch (error) {
            console.error('Error in search:', error);
            return { success: false, message: error.message };
        }
    }

    // Lấy sản phẩm theo ID
    static async getById(id) {
        try {
            // Set charset UTF-8
            await db.query("SET NAMES 'utf8mb4'");
            
            const [rows] = await db.query(`
                SELECT
                    p.product_id as id,
                    p.product_name as name,
                    p.description,
                    c.category_name as category,
                    CAST(p.price AS DECIMAL(10,2)) as price,
                    NULL as old_price,
                    CASE 
                        WHEN p.image_url LIKE 'http%' THEN p.image_url
                        WHEN p.image_url LIKE '/images/%' THEN p.image_url
                        WHEN p.image_url LIKE '../backend/images/%' THEN CONCAT('/images/', REPLACE(p.image_url, '../backend/images/', ''))
                        ELSE CONCAT('/images/', p.image_url)
                    END as image,
                    p.stock_quantity as stock,
                    p.condition_status as condition_percentage,
                    p.size_available as size,
                    NULL as badge,
                    p.created_at
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE p.product_id = ?
            `, [id]);
            if (rows.length === 0) {
                return { success: false, message: 'Không tìm thấy sản phẩm' };
            }
            return { success: true, data: rows[0] };
        } catch (error) {
            console.error('Error in getById:', error);
            return { success: false, message: error.message };
        }
    }

    // Lấy sản phẩm theo category
    static async getByCategory(category, page = 1, limit = 20) {
        try {
            // Convert to integers to avoid SQL syntax errors
            const pageNum = parseInt(page) || 1;
            const limitNum = parseInt(limit) || 20;
            const offset = (pageNum - 1) * limitNum;

            const [rows] = await db.query(`
                SELECT
                    p.product_id as id,
                    p.product_name as name,
                    p.description,
                    c.category_name as category,
                    CAST(p.price AS DECIMAL(10,2)) as price,
                    NULL as old_price,
                    CASE 
                        WHEN p.image_url LIKE 'http%' THEN p.image_url
                        WHEN p.image_url LIKE '/images/%' THEN p.image_url
                        WHEN p.image_url LIKE '../backend/images/%' THEN CONCAT('/images/', REPLACE(p.image_url, '../backend/images/', ''))
                        ELSE CONCAT('/images/', p.image_url)
                    END as image,
                    p.stock_quantity as stock,
                    p.condition_status as condition_percentage,
                    p.size_available as size,
                    NULL as badge,
                    p.created_at
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE c.category_name = ? ORDER BY p.created_at DESC LIMIT ? OFFSET ?
            `, [category, limitNum, offset]);

            const [countResult] = await db.query(`
                SELECT COUNT(*) as total
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE c.category_name = ?
            `, [category]);

            return {
                success: true,
                data: rows,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: countResult[0].total,
                    totalPages: Math.ceil(countResult[0].total / limitNum)
                }
            };
        } catch (error) {
            console.error('Error in getByCategory:', error);
            return { success: false, message: error.message };
        }
    }

    // Tạo sản phẩm mới (Admin)
    static async create(productData) {
        try {
            await db.query("SET NAMES 'utf8mb4'");
            
            // Get category_id from category name
            let categoryId = null;
            if (productData.category) {
                const [categories] = await db.query(
                    'SELECT category_id FROM categories WHERE category_name = ?',
                    [productData.category]
                );
                if (categories.length > 0) {
                    categoryId = categories[0].category_id;
                }
            }
            
            const [result] = await db.query(`
                INSERT INTO products (
                    product_name, description, category_id, price, 
                    stock_quantity, condition_status, size_available, image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                productData.name,
                productData.description || null,
                categoryId,
                productData.price,
                productData.stock || 0,
                productData.condition || 'good',
                productData.size || null,
                productData.image || 'placeholder.svg'
            ]);
            
            return {
                success: true,
                message: 'Tạo sản phẩm thành công',
                productId: result.insertId
            };
        } catch (error) {
            console.error('Error in create:', error);
            return { success: false, message: error.message };
        }
    }

    // Cập nhật sản phẩm (Admin)
    static async update(productId, productData) {
        try {
            await db.query("SET NAMES 'utf8mb4'");
            
            // Get category_id if category name is provided
            let categoryId = null;
            if (productData.category) {
                const [categories] = await db.query(
                    'SELECT category_id FROM categories WHERE category_name = ?',
                    [productData.category]
                );
                if (categories.length > 0) {
                    categoryId = categories[0].category_id;
                }
            }
            
            const updates = [];
            const params = [];
            
            if (productData.name) {
                updates.push('product_name = ?');
                params.push(productData.name);
            }
            if (productData.description !== undefined) {
                updates.push('description = ?');
                params.push(productData.description);
            }
            if (categoryId) {
                updates.push('category_id = ?');
                params.push(categoryId);
            }
            if (productData.price) {
                updates.push('price = ?');
                params.push(productData.price);
            }
            if (productData.stock !== undefined) {
                updates.push('stock_quantity = ?');
                params.push(productData.stock);
            }
            if (productData.condition) {
                updates.push('condition_status = ?');
                params.push(productData.condition);
            }
            if (productData.size !== undefined) {
                updates.push('size_available = ?');
                params.push(productData.size);
            }
            if (productData.image) {
                updates.push('image_url = ?');
                params.push(productData.image);
            }
            
            if (updates.length === 0) {
                return { success: false, message: 'Không có dữ liệu để cập nhật' };
            }
            
            params.push(productId);
            
            await db.query(`
                UPDATE products 
                SET ${updates.join(', ')}, updated_at = NOW()
                WHERE product_id = ?
            `, params);
            
            return {
                success: true,
                message: 'Cập nhật sản phẩm thành công'
            };
        } catch (error) {
            console.error('Error in update:', error);
            return { success: false, message: error.message };
        }
    }

    // Xóa sản phẩm (Admin)
    static async delete(productId) {
        try {
            // Check if product exists
            const [products] = await db.query(
                'SELECT product_id FROM products WHERE product_id = ?',
                [productId]
            );
            
            if (products.length === 0) {
                return { success: false, message: 'Không tìm thấy sản phẩm' };
            }
            
            // Check if product is in any orders
            const [orders] = await db.query(
                'SELECT order_item_id FROM order_items WHERE product_id = ?',
                [productId]
            );
            
            if (orders.length > 0) {
                // Don't delete, just set stock to 0 and mark as unavailable
                await db.query(
                    'UPDATE products SET stock_quantity = 0 WHERE product_id = ?',
                    [productId]
                );
                return {
                    success: true,
                    message: 'Sản phẩm đã được đánh dấu hết hàng (có trong đơn hàng, không thể xóa hoàn toàn)'
                };
            }
            
            // Safe to delete
            await db.query('DELETE FROM products WHERE product_id = ?', [productId]);
            
            return {
                success: true,
                message: 'Xóa sản phẩm thành công'
            };
        } catch (error) {
            console.error('Error in delete:', error);
            return { success: false, message: error.message };
        }
    }
}

module.exports = Product;
