 const  mongoose = require("mongoose");

 const userScheme = new mongoose.Schema({
  firstName: {
    type : String,
    required : true,
    trim: true,
  },
  lastName: {
    type : String,
    required : true,
    trim: true,
  },
  email: {
    type : String,
    required : true,
    trim: true,
  },
  password: {
    type : String,
    required : true,
  },
  accountType: {
    type : String,
    enum:["Admin","Student","Instructor"],
    required : true,
  },
  additionalDetails: {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref:"Profile",
  },
  courses: [{
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref:"Course",
  }],
  image: {
    type : String,
    required : true,
  },
  courseProgress: [{
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref:"CourseProogrss"
  }],
 });
 module.exports = mongoose.model("User",userScheme); 

