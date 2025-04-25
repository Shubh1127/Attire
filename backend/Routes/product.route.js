const express = require('express');
const router = express.Router();
const productController = require('../controller/Product.controller');
const authMiddleware = require('../Middlewares/auth.middleware');
const upload = require('../Middlewares/upload');

// Add Product Route
router.post(
    '/add',
    authMiddleware,
    upload.array('photo', 5), // Accept up to 5 images
    productController.addProduct
);

router.get('/all', authMiddleware, productController.getOwnerProducts);
// Edit Product Route
router.put('/edit/:productId', authMiddleware, productController.editProduct);

// Delete Product Route
router.delete('/delete/:productId', authMiddleware, productController.deleteProduct);

router.get('/getProducts', productController.getAllProducts);

router.get('/getProduct/:productId',productController.getProductById)

module.exports = router;