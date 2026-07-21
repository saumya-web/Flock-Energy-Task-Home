const User = require("../models/user")
const ApiResponse = require("../utils/ApiResponse")
const ApiError = require("../utils/ApiError")

const signUp = async function (req, res) {
  try {
    const { name, emailId, password, role } = req.body
    if (!name || !emailId || !password) {
      return res.status(400).json({ success: false, message: "name, emailId, and password are required" })
    }

    const existingUser = await User.findOne({ emailId: emailId.toLowerCase().trim() })
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" })
    }

    const createdUser = await User.create({
      name: name.trim(),
      emailId: emailId.toLowerCase().trim(),
      password,
      role: role || "user",
    })

    return new ApiResponse(res, 201, { id: createdUser._id, name: createdUser.name, emailId: createdUser.emailId, role: createdUser.role }, "User created successfully")
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const loginUp = async function (req, res) {
  try {
    const { emailId, password } = req.body
    if (!emailId || !password) {
      return res.status(400).json({ success: false, message: "emailId and password are required" })
    }

    const loginUser = await User.findOne({ emailId: emailId.toLowerCase().trim() })
    if (!loginUser) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await loginUser.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const accessToken = loginUser.generateAccessToken()
    const refreshToken = loginUser.generateRefreshToken()

    loginUser.refreshToken = refreshToken
    await loginUser.save({ validateBeforeSave: false })

    const userData = {
      id: loginUser._id,
      name: loginUser.name,
      emailId: loginUser.emailId,
      role: loginUser.role,
    }

    return new ApiResponse(res, 200, { user: userData, accessToken, refreshToken }, "Login successful")
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

module.exports = { signUp, loginUp }