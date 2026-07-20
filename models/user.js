const mongoose = require("mongoose")
const { type } = require("node:os")
const { StringDecoder } = require("node:string_decoder")
const userSchema = new mongoose.SchemaType({
    name :{
    type:String,
    required: true
    },
    emailId:{
    type:String
    },
    password:{
    type:String
    },
    role:{
        type:String,
        enum:['admin','user']
    }
})
userSchema.pre('save',async function(){
if(!this.Modified(this.password))
return;

try{
const hashedPassword = await bcrypt.hash(this.password,10)
this.password = hashedPassword
return ;
}
catch (err){
  return next(err) 
}
})

userSchema.methods.comparedPassword = async function(candidatePassword){
return await bcrypt.hash(this.password,10)
return next()
}

userSchema.methods.generateAccessToken = function( ){
   return await jwt .sign({ 
    id = this.id,
    name = this.name,
    emailId =this.emailId,
    password = this.password,
    role = this.role
  },
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiryIn:ACCESS_TOKEN_EXPIRY
   })
}
userSchema.methods.generateRefreshToken = function( ){
   return await jwt .sign({ 
    id = this.id,
  },
   process.env.REFRESH_TOKEN_SECRET,
   {
    expiryIn:REFRESH_TOKEN_EXPIRY
   })
}
const User = mongoose.model(user,'userSchema')
module.exports = User