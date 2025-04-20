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

module.exports = router;