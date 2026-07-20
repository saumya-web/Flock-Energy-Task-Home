const mongoose = require("mongoose");
const express = require("express")
require.dotenv.config()
const app = express() 
const {PORT,MONGODB_URL} = process.env

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.listen(PORT,()=>{(console.log(`server is connected,${PORT}`))})