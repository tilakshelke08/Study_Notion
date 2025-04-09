const Section = require("../models/Section");
const Subsection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// create subsection 
exports.createSubsection = async (req, res) => {

  try {
    // fetch the data 
    const { sectionId, title, timeDuration, description } = req.body;

    // extract the file/video 
    const video = req.files.videoFiles;

    // validations 
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: " All Requireed Details are Manadatory  !!",
      })

    }
    // upload video to ccloudinary
    const uploadDetails = await uploadImageToCloudinary(video, process.env.Folder_name);


    // create Subsection 
    const createSubsection = await Subsection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // update Section

    const updatedSection = await Section.findByIdAndUpdate(
     {_id:sectionId},
     {
      $push: {
       Subsection: createSubsection._id,

      }
      
    },
      { new: true },
    );

    // write down the populate



    // retrun response 
    return res.status(200).json({
      success: true,
      message: " Subsection Created Successfullly !!",
    })


  } catch (error) {
    // retrun 
    return res.status(500).json({
      success: false,
      message: "Subsection creation Failed !!",
    })

  }
}

// delete 
// delete Subsecton 
exports.deletedSubsection = async (req, res) => {

  try {
    // fetch the data 
    const {subsectionId } = req.body;

    // validations 
    if (!subsectionId) {
      return res.status(400).json({
        success: false,
        message: " All Requireed Details are Manadatory  !!",
      })

    }


    // delete Subsection 
    const deleteSubsection = await Subsection.findByIdAndDelete( subsectionId );

    // retrun response 
    return res.status(200).json({
      success: true,
      message: " Subsection deleted Successfullly !!",
      deleteSubsection,
    })


  } catch (error) {
    // retrun 
    return res.status(500).json({
      success: false,
      message: "Subsection deletion Failed !!",
    })

  }
}