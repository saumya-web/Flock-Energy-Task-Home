const Meter = require("../models/meter")
const ApiResponse = require("../utils/ApiResponse")

const handleBy = async function (req, res) {
  try {
    const meters = await Meter.find({})
    return new ApiResponse(res, 200, meters, "Meters fetched successfully")
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const handleById = async function (req, res) {
  try {
    const meter = await Meter.findById(req.params.id)
    if (!meter) {
      return res.status(404).json({ success: false, message: "Meter not found" })
    }
    return new ApiResponse(res, 200, meter, "Meter fetched successfully")
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const handleUpdateById = async function (req, res) {
  try {
    const meter = await Meter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!meter) {
      return res.status(404).json({ success: false, message: "Meter not found" })
    }
    return new ApiResponse(res, 200, meter, "Meter updated successfully")
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

const handleDeletedById = async function (req, res) {
  try {
    const meter = await Meter.findByIdAndDelete(req.params.id)
    if (!meter) {
      return res.status(404).json({ success: false, message: "Meter not found" })
    }
    return new ApiResponse(res, 200, meter, "Meter deleted successfully")
  } catch (err) {
    console.error(err)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

module.exports = {
  handleBy,
  handleById,
  handleDeletedById,
  handleUpdateById,
}