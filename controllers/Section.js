const Course = require("../models/Course");
const Section = require("../models/Section");
const User = require("../models/User");

exports.createSection = async (req, res) => {

  try {
    // fetch the data 
    const { sectionName, courseId } = req.body;

    // validations 
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: " All Requireed Details are Manadatory  !!",
      })

    }


    // create section 
    const createSection = await Section.create({ sectionName });

    // update CourseId with section objectId

    const updateCourseDetails = await Course.findByIdAndUpdate(
      courseId, {
      $push: {
        courseContent: createSection._id,

      }
    },
      { new: true },
    );

    // write down the populate



    // retrun response 
    return res.status(200).json({
      success: true,
      message: " Section Created Successfullly !!",
    })


  } catch (error) {
    // retrun 
    return res.status(500).json({
      success: false,
      message: "Section creation Failed !!",
    })

  }
}


// update secton 
exports.updatedSection = async (req, res) => {

  try {
    // fetch the data 
    const {sectionName,sectionId } = req.body;

    // validations 
    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: " All Requireed Details are Manadatory  !!",
      })

    }


    // delete section 
    const updateSection = await Section.findByIdAndUpdate( sectionId ,
      {sectionName},{new:true},
    );

    // retrun response 
    return res.status(200).json({
      success: true,
      message: " Section updated Successfullly !!",
    })


  } catch (error) {
    // retrun 
    return res.status(500).json({
      success: false,
      message: "Section updatation Failed !!",
    })

  }
}

// delete secton 
exports.deletedSection = async (req, res) => {

  try {
    // fetch the data 
    const {sectionId } = req.body;

    // validations 
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: " All Requireed Details are Manadatory  !!",
      })

    }


    // delete section 
    const deleteSection = await Section.findByIdAndDelete( sectionId );

    // retrun response 
    return res.status(200).json({
      success: true,
      message: " Section deleted Successfullly !!",
    })


  } catch (error) {
    // retrun 
    return res.status(500).json({
      success: false,
      message: "Section deletion Failed !!",
    })

  }
}