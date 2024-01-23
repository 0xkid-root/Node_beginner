const bcrypt = require("bcrypt");

 const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
  } catch (error) {
    console.log(error);
  }
};

//  comparePassowrd me two argument liya maine kyu ke mujhe password and hasedpassword me compare krn atha 
 const comparePassword = async (password,hashedPassword )=>{
    return bcrypt.compare(password,hashedPassword);
}

module.exports ={hashPassword,comparePassword}