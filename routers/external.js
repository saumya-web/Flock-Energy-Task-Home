const express = require('express')
const { loginPortal, searchMeters, getMeterGeo, getMeterEnergy } = require('../controllers/externalAuth')
const {verifyJWT,authRole} = require("../middleware/auth.js")
const router = express.Router()

router.post('/login', loginPortal)
router.get('/meters/search', verifyJWT, authRole('admin'), searchMeters)
router.get('/meters/:meterId/geo', verifyJWT, authRole('admin'), getMeterGeo)
router.get('/meters/:meterId/energy', verifyJWT, authRole('admin'), getMeterEnergy)

module.exports = router
