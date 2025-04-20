const express = require('express');
const router = express.Router();
const ownerController = require('../controller/Owner.Controller');
const auth = require('../Middlewares/auth.middleware');
const upload = require('../Middlewares/upload'); // Assuming you have a middleware for handling file uploads

router.post('/register', ownerController.register);
router.post('/login', ownerController.login);
router.get('/logout', auth,ownerController.logout); // optional
router.get('/profile', auth, ownerController.getProfile);

router.put('/updateProfilePicture', auth, upload.single('profilePicture'), ownerController.updateProfilePicture);
router.put('/updatePassword', auth, ownerController.updatePassword);

module.exports = router;
