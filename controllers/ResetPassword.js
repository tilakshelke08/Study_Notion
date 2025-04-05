
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
// reset password token 

exports.resetPasswordToken = async (req, res) => {

  try {
    // fetch email from reqq.body
    const email = req.body.email;

    //check user for this emai, emai validations 
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
        message: " Email was not Registtered with Us !!",
      })
    }

    // generate token 
    const token = crypto.randomUUID();

    // update  user by adding token and expiration time 
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExppires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // cretae url 
    const url = `http"//localhost:3000/update-password/${token}`

    // send mail containg the url 

    await mailSender(email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );
    return res.json({
      success: true,
      message: "Email Send Successfully please Check the Email And Change the Password !!!"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: " Something went wrogn while resetig the passwords !! !!!"
    });
  }
}


// reset password 

exports.resetPassword = async (req, res) => {
  try {
    // data fetch 

    const { password, confirmPassword, token } = req.body;

    // valiadtions 
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: " Password Not match !!!",
      });
    }

    // get userDetails from db using token 
    const userDetails = await User.findOne({ token: token });

    //if no  entry invalid token 

    if (!userDetails) {
      return res.json({
        success: false,
        message: " Token is Invalid  !!!",
      });
    }
    // token time check 
    if (userDetails.resetPasswordExppires < Date.now()) {
      return res.json({
        success: false,
        message: " Token Rxpires , Plz regenerate Token  !!!",
      });
    }

    // hashed password 
  const hashedPassword = await bcrypt.hash(password,10);
    // password update 
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true },
    );

    // retruyn response 
    return res.status(200).json({
      success: true,
      message: " Password reset successfully !!!!!!!",
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: " Something went wrong while rseting the passwords  !!!",
    });
  }
}