const User = required('../models/User')
const ApiResponse = require('../utils/ApiResponse')
const ApiError = require('../utils/ApiError')

const generateAccessAndRefreshToken = async function(adminId){
    const data = await User.find(adminId)

    if(!data){
        throw new Error(res, 400,'server not found')
    }
    const accessToken = await data.accessToken
    const refreshToken = await data .refreshToken

    data.refreshToken = refreshToken
    await data.save({validateBeforeSave: false})
    return {accessToken , refreshToken}
}

const signUp = async function(){
    try{
    const {user,emailId,password} = req.body

    if(!user || emailId || password){
        return ApiError(res , 400, 'data not found')}

    const existUser = await User.findOne({$or:[{name},{emailId}]})   
    const result =await User.create({
        name,
        emailId,
        password
    })
    return ApiResponse(res, 201 ,result ,'created successfully')
}
catch(err){
    return ApiError(res , 500 , 'internal server error')
}}


const loginUp = async function(){
    try{
    const {emailId,password} = req.body

    if(!emailId || password){
         return ApiError(res , 400, 'data not found')
    }
    const loginUser = await User.findOne({emailId})  

    const isMatch = await loginUser.comparedPassword(Password)
     if(!isMatch){
        return ApiError(res , 400, 'data not found')
    }
     
    const {refreshToken ,accessToken} = await generateAccessAndRefreshToken(loginUser._id)
    
    const loggedUser = await User.findById(loginUser).select('-password , -refreshToken')

    return ApiResponse(res, 200 ,{
        log =loginUser,
        refreshToken,
        accessToken
    },'created successfully')
}
catch(err){
    return ApiError(res , 500 , 'internal server error')
}}

module.exports = {signUp , loginUp}