const Profile = require("../models/Profile");

const User = require("../models/User");

// crreate profile alreday created so. no need to  creatte agaain 

// go for delete profile 
exports.deleteProfile = async (req, res) => {

  try {
    // fetch the data 
    const id = req.user.id;

     const userDetails = await User.findById(id);
    // validations 
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: " user not found  !!",
      })

    }

     // delete  Profile 
      await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
     
      // delete useer
      await User.findByIdAndDelete({_id:id});


    // retrun response 
    return res.status(200).json({
      success: true,
      message: " Profile deleted Successfullly !!",
      profileDetails,
    })


  } catch (error) {
    // retrun 
    return res.status(500).json({
      success: false,
      message: "Profile deleted   Failed !!",
    })

  }
}

// get  all user details 
exports.getAlllProfile = async (req, res) => {

  try {
    // fetch the data 
    const id = req.user.id;
   
   // validations and get user  details 

     const userDetails = await User.findById(id).populate("additionalDetails").exec();
   
    // retrun response 
    return res.status(200).json({
      success: true,
      message: " getting all userdetails Successfullly !!",
      profileDetails,
    })


  } catch (error) {
    // retrun 
    return res.status(500).json({
      success: false,
      message: "getting all userdetails    Failed !!",
    })

  }
}