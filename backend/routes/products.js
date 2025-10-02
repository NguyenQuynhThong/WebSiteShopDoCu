const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Lấy tất cả sản phẩm
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, category } = req.query;
        const result = await Product.getAll(page, limit, category);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// GET /api/products/search - Tìm kiếm sản phẩm
router.get('/search', async (req, res) => {
    try {
        const { q, category, priceRange, page = 1, limit = 20 } = req.query;
        
        if (!q || q.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập từ khóa tìm kiếm'
            });
        }

        const result = await Product.search(q, category, priceRange, page, limit);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// POST /api/products - Tạo sản phẩm mới (Admin)
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        
        // Validation
        if (!productData.name || !productData.price || !productData.category) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin sản phẩm'
            });
        }
        
        const result = await Product.create(productData);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// PUT /api/products/:id - Cập nhật sản phẩm (Admin)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        
        const result = await Product.update(id, productData);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// DELETE /api/products/:id - Xóa sản phẩm (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Product.delete(id);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// GET /api/products/:id - Lấy chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Product.getById(id);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

// GET /api/products/category/:category - Lấy sản phẩm theo category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 20 } = req.query;
        const result = await Product.getByCategory(category, page, limit);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
});

module.exports = router;
