const express = require("express")
const{loginUp , signUp} = require('../controllers/user')

const router = express.Router()

router.post('/',signUp)
router.post('/',loginUp)

module.exports = router