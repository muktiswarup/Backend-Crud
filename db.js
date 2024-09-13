const mongoose=require('mongoose');
const mongourl=process.env.MONGOURL;
const dbconnect=  mongoose.connect (mongourl)
.then(()=>{
     console.log("Database connected")
})
.catch((err)=>{
    console.log(err)
})

module.exports=dbconnect;