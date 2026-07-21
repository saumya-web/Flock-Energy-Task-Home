const express = require('express')
const { loginPortal, searchMeters, getMeterGeo, getMeterEnergy } = require('../controllers/externalAuth')
const router = express.Router()

router.post('/login', loginPortal)
router.get('/meters/search', searchMeters)
router.get('/meters/:meterId/geo', getMeterGeo)
router.get('/meters/:meterId/energy', getMeterEnergy)

module.exports = router
