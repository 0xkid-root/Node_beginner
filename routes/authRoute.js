const express = require('express');
const {registerController,loginController,testController,forgotPasswordController,resetPasswordController,profileController,profileUpdateController,refreshController,logoutController} = require('../controllers/authController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
// router object is here :---

const router = express.Router();


//Routing 
// register method post 
router.post('/register',registerController)

// login method post 
router.post('/login',loginController)

// forgot password || post 

router.post('/forgot-password',forgotPasswordController)
router.get('/reset-password',resetPasswordController)

// authenticated routes is here 
router.get('/profile',requireSignIn,profileController)
router.patch('/profile-update',requireSignIn,profileUpdateController)
router.get('/refresh-token',requireSignIn,refreshController)
router.get('/logout',requireSignIn,logoutController)
// test routes --

router.get('/test',requireSignIn,isAdmin,testController)

router.get('/user-auth',requireSignIn,(req,res) =>{
    res.status(200).send({
        ok:true
    });
})
 

module.exports = router;