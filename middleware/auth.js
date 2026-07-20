const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError")
const ApiResponse = require('../utils/ApiResponse');
const { verify } = require("node:crypto");

const verifyJWT = (req,res,next)=>{
    const authHeader = req.header.authorization()

    const Token = authHeader.split(" ")[1]
    if(!Token){
        return ApiError(res, 400, 'data not found')
    }
    const decoded =jwt.verify(process.env.Access_Token_SECRET,Token)
    req.user = decoded
    return next()
}

const generateToken = async function (userId){
    return jwt.sign({
            name = userId.name,
            emailId = userId.emailId,
            password = userId.password
   },
   process.env.ACCESS_TOKEN_EXPIRY,{expiryIn:'1d'})
}
module.exports = {generateToken , verifyJWT}
