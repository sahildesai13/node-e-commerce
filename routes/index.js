var express = require('express');
var router = express.Router();
var user = require('../controller/userController')
var Admin = require('../controller/adminController')
const categoryCheck = require('../middlewares/categorycheck');
const cart = require('../controller/CartController')
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage })

router.get('/', user.getData);
router.get('/category/:id',categoryCheck.checkId ,user.getCategory);
router.get('/search',user.searchProduct);
// user login-Signup system--------------------------------------------
router.post('/signup', user.userSignUp);
router.post('/login', user.userLogin);
router.get('/logout', user.userLogout);
router.get('/dashboard', user.userDashboard);
router.post('/cart/:id', cart.addToCart);
router.post('/updateCart/:id',cart.updateCart);
router.post('/deleteSingleItem/:id',cart.deleteItem);
router.post('/deleteCart',cart.DeleteCart)
router.get('/showCart',cart.GetCart)
// Admin login-Signup system--------------------------------------------
router.post('/AdminSignUp', Admin.AdminSignUp);
router.post('/AdminLogin', Admin.AdminLogin);
router.get('/AdminLogout', Admin.AdminLogout);
router.post('/AdminDashboard', upload.single('image'), Admin.AdminDashboard);
router.post('/updateProduct/:id',upload.single('image'), Admin.updateProduct);
router.get('/deleteProduct/:id', Admin.deleteProduct);


module.exports = router;