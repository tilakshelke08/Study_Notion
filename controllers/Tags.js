
// import the modells 

const Tag = require("../models/tags");


// created Tags ..
exports.createTag = async (req, res) => {

  try {

    // fetch the data 
    const { name, description } = req.body;

    // validation  

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: " Please  Fill the Above Required Details",
      })
    }

    // crreated Entry in database 

    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });

    console.log(tagDetails);

    // retrun rresponse 
    return res.status(200).json({
      success: true,
      message: " Tag Created Successfully !!",
    })

  } catch (error) {
    // return 
    console.error(error);
    return res.status(500).json({
      success: false,
      message: " Tags Creation Failed !!",

    })

  }


}

// show  all Tags ..
exports.showAllTag = async (req, res) => {

  try {
// Getting all tags 
   
const showTags = await Tag.find({},{name:true,description:true});// you are getting all tags but 
// its necessary you have to got min. name and description in all Tags .

    console.log(showTags);

    // retrun rresponse 
    return res.status(200).json({
      success: true,
      message: " Showing all  Tags  Successfully !!",
    })

  } catch (error) {
    // return 
    console.error(error);
    return res.status(500).json({
      success: false,
      message: " showing  All Tags  Failed !!",

    })

  }


}

