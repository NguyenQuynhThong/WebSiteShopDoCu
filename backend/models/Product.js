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

            if (category && category !== 'all') {
                // Map frontend category names to database category names
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
}

module.exports = Product;
