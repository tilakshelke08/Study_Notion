// import models
const Course = require("../models/Course");
const User = require("../models/User");
const Tag = require("../models/tags");
const imageUploader = require("../utils/imageUploader");

// create Course

exports.createCourse = async (req, res) => {
  try {

    // fetch the data 
    const { courseName, courseDescription, whatYouWillLearn,
      price,
      tag } = req.body;

    //  fetch file from cloudinary file 
    const thumbnail = req.file.thumbnailImage;

    // validations 
    if (!courseName || !courseDescription || !whatYouWillLearn ||
      !price || !tag) {
      return res.status(400).json({
        success: false,
        message: " All Fields are Required !!",
      })
    }

    // check for instructor 
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log(instructorDetails);

    // valiadtion on instructor 
    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: " Instructor details are not found !!",
      })
    }

    // check for tag 
    const tagDetails = await Tag.findById(tag);
    console.log(tagDetails);

    // valiadtion on tag 
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: " Tag details are not found !!",
      })
    }

    // upload Image to Cloudinarry
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.Folder_name);

    // create course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag: tagDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // uppdate the instructor 
    await User.findByIdAndUpdate({
      _id: instructorDetails._id
    },
      {
        $push: {
          courses: newCourse._id,
        }
      },
    )

    // uppdate the tag 
    await User.findByIdAndUpdate({
      _id: tagDetails._id
    },
      {
        $push: {
          courses: newCourse._id,
        }
      },
    )



    return res.status(200).json({
      success: true,
      message: " Course Creation Successfully !!",
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: " Course Creation Failed !!",
      data: newCourse,
    })
  }

}

// Get All coiurses
exports.showAllCourse = async (req, res) => {
  try {
    // get all  course

    const showAllCourse = await Course.find({},
      {
        courseName:true,
        courseDescription:true,
        instructor:true,
        whatYouWillLearn:true ,
        price:true,
        thumbnail:true,
      }
    ).populate("instructoe").exec();


    return res.status(200).json({
      success: true,
      message: " Showing All Course Successfullly !!",
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: " Showing All Course Failed !!",
    })
  }

}