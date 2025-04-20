const express=require('express');
const router=express.Router();
const CartController=require('../controller/Cart.controller');
const authMiddleware=require('../Middlewares/auth.middleware');





//orders and cart
router.post('/addToCart',authMiddleware,CartController.addToCart);
router.get('/cart',authMiddleware,CartController.getCart);
router.put('/updatecart',authMiddleware,CartController.updateCart);
router.delete('/cart',authMiddleware,CartController.deleteCart);






module.exports=router;