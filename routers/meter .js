const express = require("express")
const {handleBy,handleById,handleUpdateById,handleDeletedById,
} = require("../controllers/meter conroller .js")
const{ verifyJWT ,authRole} = require("../middleware/auth.js")

const router = express.Router()

router.get("/",verifyJWT,authRole('admin'),handleBy)
router.get("/:id",verifyJWT,authRole('admin'),handleById)
router.put("/:id",verifyJWT,authRole('admin'),handleUpdateById)
router.delete("/:id", verifyJWT,authRole('admin'), handleDeletedById)

module.exports = router
