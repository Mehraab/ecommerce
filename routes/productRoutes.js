const express = require('express');
const { protect, admin } = require('../middlewares/auth');
const { createProduct, getProduct, getAllProducts } = require('../controller/productController');
const router = express.Router();

router.post('/', createProduct);
router.get('/getall', getAllProducts);
router.get('/:id', getProduct);

module.exports = router;
