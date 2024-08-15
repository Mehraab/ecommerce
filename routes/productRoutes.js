const express = require('express');
const { protect, admin } = require('../middlewares/auth');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('../controller/productController');
const router = express.Router();

router.post('/', protect, admin, createProduct);
router.get('/getall', getAllProducts);
router.put('/:id', protect, admin, updateProduct);
router.get('/:id', getProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
