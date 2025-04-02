const express = required("express");
const app = express();

app.use("/get", (req,res)=>{
res.send(" Data is Displayed on Server !!!!");
});