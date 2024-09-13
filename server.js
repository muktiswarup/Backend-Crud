const express=require('express');
require('dotenv').config();
require("./db")
const PORT=process.env.PORT || 6000
const app=express();
app.use(express.json());
app.use('/api/users',require('./Routes/Users'))

app.get('/',(req,res)=>{
    res.send("Hello i am there");
})


app.listen(PORT,(err)=>{
    if (err) throw err
    console.log('sever stared')
})