
// import the modells 

const Tag = require("../models/category");


// created Tags ..
exports.createCategory = async (req, res) => {

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

    const categoryDetails = await Tag.create({
      name: name,
      description: description,
    });

    console.log(categoryDetails);

    // retrun rresponse 
    return res.status(200).json({
      success: true,
      message: " Category Created Successfully !!",
    })

  } catch (error) {
    // return 
    console.error(error);
    return res.status(500).json({
      success: false,
      message: " Category Creation Failed !!",

    })

  }


}

// show  all Category ..
exports.showAllCategory = async (req, res) => {

  try {
// Getting all Category 
   
const showCategory = await Tag.find({},{name:true,description:true});// you are getting all tags but 
// its necessary you have to got min. name and description in all Tags .

    console.log(showCategory);

    // retrun rresponse 
    return res.status(200).json({
      success: true,
      message: " Showing all  Category  Successfully !!",
    })

  } catch (error) {
    // return 
    console.error(error);
    return res.status(500).json({
      success: false,
      message: " showing  All Category  Failed !!",

    })

  }


}

