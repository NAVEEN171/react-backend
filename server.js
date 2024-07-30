const express=require("express")
const mongoose=require("mongoose")
require("dotenv").config()
const cors=require("cors")
const bodyParser=require("body-parser");

const app=express()

app.use(cors())
app.use(bodyParser.json())





 mongoose.connect("mongodb+srv://naveenkumar:1234567890@jobsinfo.3dzry2n.mongodb.net/?retryWrites=true&w=majority&appName=jobsinfo")
.then(()=>{
    console.log("Connected to database")
})
.catch((err)=>{
    console.log(err)
})
app.listen(5000,()=>{
    console.log("port is running on 5000")
})


const db = mongoose.connection.useDb("jobinformation");
const jobs = db.collection("jobs");

app.get("/",()=>{
  console.log("deployed")
})
app.get("/getsalaries",async(req,res,next)=>{
  try{
    console.log("hi")
    const data=await jobs.aggregate([
        {
          $match: {
            "company_data.industries":{
              $in:["Tech, Software & IT Services"]
            }
            
          }
        },
        {
          $group: {
            _id:null,
            averageMaxSalary:{
              $avg:"$salary_range.max"
            },
            averageMinSalary:{
              $avg:"$salary_range.min"
            }
          
          }
        },
        {
          $project:{
            _id:0,
            averageMaxSalary:1,
            averageMinSalary:1
          }
        }
        
      ]).toArray();
      if(data){
        console.log(data);
        return res.json(data[0])
      }
  }
  catch(err){
    console.log(err);
  }

})
