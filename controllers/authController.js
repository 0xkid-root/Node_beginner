const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel");
const Blacklist = require("../models/blacklist");
const JWT = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    console.log("::", req.body);
    // validations ----
    if (!name) {
      return res.send({ message: "Name Is Required" });
    }
    if (!email) {
      return res.send({ message: "Email Is Required" });
    }
    if (!password) {
      return res.send({ message: "Password Is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone No Is Required" });
    }
    if (!address) {
      return res.send({ message: "Address Is Required" });
    }

    // check user ---
    const existingUser = await userModel.findOne({ email });

    // existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register Please Login",
      });
    }

    // register user ---
    //  hash passowrd function
    const hashedPassword = await hashPassword(password);

    //save

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();
   return res.status(200).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
   return res.status(500).send({
      success: false,
      messsage: "Error in Registration",
      error,
    });
  }
};

// generate refresh token ----

// login function ----

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validation ====
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or Password",
      });
    }
    // check user  beacuse databse se hash password find krna hai --

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    // password match se hash password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // token generate
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );

   return res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
   return res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

const sendResetPasswordMail = async (name, email, otp) => {
  try {
    console.log("hello name:===", name, email);
    console.log(process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      secureConnection: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "For Reset Passowrd",
      html:
        "<p> Hii " +
        name +
        ", please copy the link and reset the password . this is your OTP " +
        otp +
        "</p>",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent :--", info.response);
      }
    });
  } catch (error) {
   return res.status(400).send({ success: false, msg: error.message });
  }
};

//forgot passowrd function =--==

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).send({ message: "Email is required" });
    }
    const userData = await userModel.findOne({ email });

    // check ====
    if (!userData) {
     return  res.status(401).send({
        success: false,
        message: "Email is not Registered",
      });
    }
    // otp generate is here ----

    const OtpData = Math.floor(Math.random() * 1000000);
    console.log(OtpData);

    const data = await userModel.updateOne(
      { email: email },
      { $set: { otp: OtpData } }
    );
    console.log(data);
    sendResetPasswordMail(userData.name, userData.email, OtpData);

    return res.status(200).send({
      success: true,
      message: "Please Check Your Inbox",
    });

    // let transporter = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     type: 'OAuth2',
    //     user: process.env.MAIL_USERNAME,
    //     pass: process.env.MAIL_PASSWORD,
    //     clientId: process.env.OAUTH_CLIENTID,
    //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
    //     refreshToken: process.env.OAUTH_REFRESH_TOKEN
    //   }
    // });
  } catch (error) {
    console.log(error);
   return res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const valueData = await userModel.findOne({ email: email }, { otp: otp });
    if (valueData) {
      const hashPassNew = await hashPassword(password);
      const valueData = await userModel.updateOne({ password: hashPassNew });
      console.log("password is updates:", valueData);
     return res.status(200).send({
        success: true,
        msg: "Password is updates",
      });
    } else {
     return res.status(200).send({
        success: false,
        msg: "This Link Has Been Expired",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

// dashboard routes ---

const profileController = async (req, res) => {
  try {
    const userData = req.user;
    console.log(userData._id);
    const valueData = await userModel
      .findById(userData._id)
      .select("name email role");
   return res.status(200).send({
      success: true,
      msg: "User Profile Data",
      data: valueData,
    });
  } catch (error) {
    console.log(error);
   return res.status(404).send({
      success: false,
      message: "Something went Wrong",
      error,
    });
  }
};

const profileUpdateController = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (name || email || phone || address) {
      const userData = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            name,
            email,
            phone,
            address,
          },
        },
        { new: true }
      );
     return res.status(200).send({
        success: true,
        msg: "User updated successfully",
        user: userData,
      });
    } else {
      return res.status(201).send({
        success: false,
        msg: "provided your data",
      });
    }

    // if (!email) {
    //   return res.send({ message: "Email Is Required" });
    // }
  } catch (error) {
    console.log(error);
    return res.status(404).send({
      success: false,
      msg: "Something Went Wrong",
      error,
    });
  }
};

const refreshController = async (req, res) => {
  try {
    const userId = req.user._id;
    const userData = await userModel.findOne({ _id: userId });
    console.log(userData);

    const accessToken = await JWT.sign({ userData }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = await JWT.sign({ userData }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
   return res.status(200).send({
      success: true,
      msg: "Token Refreshed !!!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(404).send({
      success: false,
      msg: "Something Went Wrong",
      error,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("token is here", token);
    const newBlacklist = await new Blacklist({ token }).save();
    // jo v store kiya hoga frontend developer ne wo clear ho jaye ga ---

    res.setHeader("Clear-Site-Data", '"cookies","storage"');
   return res.status(200).send({
      success: true,
      msg: "You Are logged Out!",
    });
  } catch (error) {
    console.log(error);
   return res.status(404).send({
      success: false,
      msg: "Something Went Wrong",
      error,
    });
  }
};

// test controller

const testController = (req, res) => {
 return  res.send("protected Routes");
};

module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  resetPasswordController,
  profileController,
  profileUpdateController,
  refreshController,
  logoutController,
};
