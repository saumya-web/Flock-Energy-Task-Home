const mongoose = require("mongoose")

const meterSchema = new mongoose.Schema({
  METERNO: {
    type: String,
    required: true,
  },
  SERIAL: {
    type: String,
    required: true,
  },
  MAKE: {
    type: String,
    required: true,
    enum: ["HPL", "L&T", "Genius", "Allied", "Secure"],
  },
  PHASE: {
    type: String,
    enum: ["single", "three"],
  },
  STATUS: {
    type: String,
    enum: ["installed", "Faulty", "Decommissioned"],
  },
  DT: {
    type: String,
    required: true,
  },
})

const Meter = mongoose.models.Meter || mongoose.model("Meter", meterSchema)
module.exports = Meter