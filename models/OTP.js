
const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const otpSchema =  new mongoose.Schema({
email:{
    type : String,
    required : true,
   },

otp:{
    type : String,
    required : true,
    
   },
   createdAt:{
    type : Date,
    default:Date.now(),
    expires:5*60,
   },

}
);

// otp email send 

async function sendVerification(email,otp) 
{
try{
const mailResponse = await mailSender(email,"veriication Email from StudyNotion",otp);
console.log("Email Send Successfully !!",mailResponse);
} catch{
  console.log("Error Occured while Sending mails " +error);
  throw error;
} 
}

otpSchema.pre("save",async function(next) {
  await sendVerification(this.email,this.otp);
  next();
})


module.exports = mongoose.model("OTP",otpSchema);