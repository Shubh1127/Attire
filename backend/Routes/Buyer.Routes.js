const express=require('express');
const router=express.Router();
const BuyerController=require('../controller/Buyer.controller');
const authMiddleware=require('../Middlewares/auth.middleware');
const upload=require('../Middlewares/upload');

router.post('/register',BuyerController.register);
router.post('/login',BuyerController.login);
router.get('/logout',authMiddleware,BuyerController.logout);
router.get('/profile',authMiddleware,BuyerController.getProfile);
router.put('/updateprofile',authMiddleware,upload.single('profileImage'),BuyerController.updateProfile);



//address
router.post('/addAddress',authMiddleware,BuyerController.addAddress);
router.put('/address/:index',authMiddleware,BuyerController.updateAddress);
router.delete('/address/:index',authMiddleware,BuyerController.deleteAddress);
router.put('/address/default/:index', authMiddleware, BuyerController.setDefaultAddress);

// //orders and cart
// router.post('/addToCart',authMiddleware,BuyerController.addToCart);
// router.get('/cart',authMiddleware,BuyerController.getCart);
// router.put('/updatecart',authMiddleware,BuyerController.updateCart);
// router.delete('/cart',authMiddleware,BuyerController.deleteCart);


//Forgot Password
// router.post('/forgot',BuyerController.ForgotPassword);
// router.post('/addNewPassword', BuyerController.addNewPassword);

module.exports=router;