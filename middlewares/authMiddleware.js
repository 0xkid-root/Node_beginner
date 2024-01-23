const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');

//  hum middleware bana rh hai jeske through route ko protect kare gee --\

// protected routes token base 

const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token);
      const decode = JWT.verify(
        token,
        process.env.JWT_SECRET
      );
      console.log(decode)
      req.user = decode;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({
        success: false,
        msg:'A Token is Require'
      })
    }
  };

  const isAdmin = async(req,res,next)=>{
    try{
        console.log("################################", req.user._id)
        const user = await userModel.findById(req.user._id);
        if(user.role !== 1){
            return res.status(401).send({
                success:false,
                message:'UnAuthorized Access',

            })
        }else{
            next();
        }

    } catch(error){
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:"Error In Admin MiddleWare",
        })
    }

     
  }
  

  // const updateProfileValidator = ()=>{
  //   check('name','Name is required').not().isEmpty(),
  //   check('phone','phone No, Should Be Contains 10 digits').isLength({
  //     min:10,
  //     max:10
  //   })
  // }
  



module.exports = {requireSignIn,isAdmin}