
const { mongoose } = require("mongoose");
const { instance } = require("../config/razorpay");

const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { default: orders } = require("razorpay/dist/types/orders");
const { json } = require("express");
// const courseEnrolment

// capture the paaymeents  amnd integrate  with the Razorpay

exports.capturePayment = async (req, res) => {

  // get course id  and user id 
  const { course_id } = req.body;

  const user_id = req.user.id;

  // validatiion 
  // valid course_id
  if (!course_id) {
    return res.json({
      success: false,
      message: " please provide the Course ID",
    });


  }
  // valid courseDetails

  let course;
  try {
    //below one find the course details  from course_id 
    course = await Course.findById(course_id);

    if (!course) {
      return res.json({
        success: false,
        message: " could not find the course !!",
      });
    }

    //  check user already buy cousre or not 

    // currrent 'user_id'  is string type . and  Course 'user' is object type 
    // i.e  they convert string into objectid 

    const uid = new mongoose.Types.ObjectId(user_id);
    // below one check user enrolled or not 
    if (course.studentsEnrolled.includes(uid)) {
      return res.json({
        success: false,
        message: " Student are alrready enrolled !!",
      });
    }


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: " something went erong ",
    });
  }

  // order create 
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    recipt: Math.random(Date.now()).toString(),
    notes: {
      course_id: course_id,
      user_id,
    }

  };

  // initaiise the payment using razorpay
  try {
    const paymentResponse = await instance.orders.create(options);
    console, log(paymentResponse);
    //

    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      thumbNail: course.thumbnail,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      message: " initiate order successfully ",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: " could not initiate odrer !!",
    });
  }
}

//  verify the Signature of Razoropay and Server
// secret key 
const webhookSecret = "12345678";

// this is razorpay beahaviour 
const Signature = req.headers["x-razorpay-signature"];

// convert above  secret key into hashed format 

// 1st step
const shasum = crypto.createHmac("sha256", webhookSecret);
// hmac need (hash algo , secret key)

//2nd stepp 
// object convert into string 
shasum.update(JSON.stringify(req.body));

// step 3
// when you hashing algo run on any string the output is "digest" term.
const digest = shasum.digest("hex");

// check payment authorised or not 

if (Signature === digest) {
  console.log("Payment Authorised !!!");

  // fetch the courseId and userId from notes.

  const { courseId, userId } = req.body.payload.payment.entity.notes;

  try {
    // full fill the action 

    // find the course and enroll the stucnt in it 
    const enrolledCourse = await Course.findByIdAndUpdate({ _id: courseId },
      { $push: { studentsEnrolled: userId } },
      { new: true },
    );

    if (!enrolledCourse) {
      return res.status(400).json({
        success: false,
        message: "Course Not Found  !!",
      });
    }

    console.log(enrolledCourse);

    //// find the cours and enroll the stucnt in it 

    const enrolledStudent = await User.findByIdAndUpdate({ _id: userId },
      { $push: { courses: courseId } },
      { new: true },
    )

    if (!enrolledStudent) {
      return res.status(400).json({
        success: false,
        message: "Student not found !!",
      });
    }
    console.log(enrolledStudent);

    // send mail for successfull enrolled course 

    const mailResponse = await mailSender(
      enrolledStudent.email,
      "congratulation from Codhelp ",
      "Congratulation for   Successfully  enrolling the course !!",

    );

    console.log(mailResponse);


    // return response
    return res.status(200).json({
      success: true,
      message: " Signature verified and course addaed !! !!",
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: " something went wrong !! !!",
    });
  }

}else{
  return res.status(500).json({
    success: false,
    message: " Invalid Request!!",  
  });
}