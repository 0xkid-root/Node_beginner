const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    
    {
    name:{
        type:String,
        required:true,
        trim:true,
        validate: {
            validator: (value) => {
              return /^[A-Za-z\s]+$/.test(value);
            },
            message: 'Name should contain only alphabets.'
          }
    },
    email:{
        type:String,
        required:true,
        validate:{
            validator: function(value){
                //  const emailRegex = ; 
                 return /^[a-zA-Z0-9. _%+-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{3,}$/.test(value);
                // let condition = (val == 'test@gmail.com') ? false :true ;
                // return condition
            },
            message: props=>`${props.value} is not valid`
        }, 
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    otp:{
        type:Number,
    },
    role:{
        type:Number,
        default:0
    }

},
{
    timestamps:true,
}
)


// jab v user create hoga tab uske time store ho jaye ga  ---

module.exports = mongoose.model('User',userSchema);