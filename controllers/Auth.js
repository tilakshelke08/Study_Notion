const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-genrator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// send otp 
exports.sendOTP = async (req, res) => {

  try {
    // fetch emailfrom req.body

    const { email } = req.body;

    // check user already registered or not .
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User Already Registered !!",
      })
    }

    // generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generator", otp);

    // check unique otp or not
    const result = await OTP.findOne({ ot: otp });

    // if otp is not unique then  again reate new one 
    while (result) {
      otp = otpGenerator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      // and again check otp unique or not 
      result = await OTP.findOne({ ot: otp });


    }
    // otp storing on databse 
    const otpPayload = { email, otp };

    // create an entry for an otp
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    // return reponse Successfully 
    res.status(200).json({
      success: true,
      message: "OTP sent Successfully !!!!",
      otp,

    })
  }
  catch (error) {

    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }



};

// signup 


exports.signUp = async (req, res) => {
  try {

    // fetch the data from req.body 
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp
    } = req.body;

    // validation 

    if (firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All Fields are required !!!",
      })
    }

    // password match or not 

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: " password and confirmed password value doesn't match , please try again !!!",
      });
    }

    // check the user already registered or not 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status({
        success: false,
        message: " User is Already Registred !!",
      })
    }

    // fine the most  recent otp stsored for the User.

    const recentOtp = (await OTP.find({ email })).sort({ createdAt: -1 }).limit(1);
    console.log(recentOtp);

    // validate  otp 
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: " Otp Not found !!",
      })
    } else if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: " Invalid otp found !!",
      })
    }
    // hashed ppassword 
    const hashedPassword = await bcrypt.hash(password, 10);

    //entry creatd in databaase 

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id, // profile ddetails above created 
      image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })


    // return response 
    return res.status(200).json({
      success: true,
      message: " User is Registered Successfully !!!",
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: " User can't Registered Successfully please try again later !!!",
    });
  }
}

// login    

exports.login = async (req, res) => {
  try {
    // fetch the data from req.bbody

    const { email, password } = req.body;

    // validation data
    if (!email || !password) {

      return res.status(403).json({
        success: false,
        message: " All fields are required !!",
      })
    }

    // user check exist or not 
    const user = await User.findOne({ email }).populate({ additionalDetails });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: " user is not Registered plz Registered First !!",
      })
    }

    // gerenate JWT, password matching 
    if (await bcrypt.compare(password, user.password)) {

      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      user.token = token;
      user.password = undefined;

      // create cookie and send response 

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,

      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: " Logged in Successfully !!!",
      })

    }else{
      return res.status(401).json({
        success: false,
        message: " Paassword is Incorrect  !!!",
    });
  }

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: " Login Failed , Please try again later !!!",
    })
  }
}

//isStudent 

exports.isStudent = async (req,res,next) =>{
  try{

    if(req.user.accountType !== "Student"){
      return res.status(401).json({
        success: false,
        message: " This is protected  Accessed by Only  for Student !!",
      })
    }
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "User role can't be verified !!!",
    })
  }
}

//isInstructor

exports.isInstructor = async (req,res,next) =>{
  try{

    if(req.user.accountType !== "Instructor"){
      return res.status(401).json({
        success: false,
        message: " This is protected  Accessed by Only  for Instructor !!",
      })
    }
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "User role can't be verified !!!",
    })
  }
}

// isAdmin

exports.isAdmin = async (req,res,next) =>{
  try{

    if(req.user.accountType !== "Admin"){
      return res.status(401).json({
        success: false,
        message: " This is protected  Accessed by Only  for Admin !!",
      })
    }
  }catch(error){
    return res.status(500).json({
      success: false,
      message: "User role can't be verified !!!",
    })
  }
}