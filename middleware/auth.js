const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//auth
exports.auth = async (req, res, next) => {

  try {

    // extract the token 
    const token = req.cookies.token || req.body.token || req.header('Authorisation').replace("Bearer ", "");

    // if token is missing the return the response 

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token is missing , plz try  again '
      });
    }


    // verify the token.. 
    try {

      const decode = await jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      req.user = decode;

    } catch (error) {
      // verification issue 
      return res.status(401).json({
        success: false,
        message: 'Token is invalid !!!!'
      });
    }
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'something went wrong while validating the token !!!'
    });
  }
}

// isStudent 

