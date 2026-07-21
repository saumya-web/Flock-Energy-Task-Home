const express = require("express")
const {
  handleBy,
  handleById,
  handleUpdateById,
  handleDeletedById,
} = require("../controllers/meter conroller .js")

const router = express.Router()

router.get("/", handleBy)
router.get("/:id", handleById)
router.put("/:id", handleUpdateById)
router.delete("/:id", handleDeletedById)

module.exports = router
