
const mongoose = require("mongoose");

const tagsSchema =  new mongoose.Schema({
name:{
    type : String,
    required : true,
   },

description:{
    type : Number,
    required : true,
    trim: true
   },
   course:{
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref:"Course",
   },

}
);
module.exports = mongoose.model("Tags",tagsSchema);