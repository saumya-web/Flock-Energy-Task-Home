const jwt = require("jsonwebtoken")

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authorization token missing" })
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "secret")
    req.user = decoded
    return next()
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" })
  }
}

const authRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" })
    }
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ success: false, message: "Access denied" })
    }
    return next()
  }
}

const generateToken = async function (user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      emailId: user.emailId,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET || "secret",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  )
}

module.exports = { generateToken, verifyJWT, authRole }
