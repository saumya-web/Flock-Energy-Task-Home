const express = require("express")
const { signUp, loginUp } = require("../controllers/user")

const router = express.Router()

router.post("/signup", signUp)
router.post("/login", loginUp)

module.exports = router