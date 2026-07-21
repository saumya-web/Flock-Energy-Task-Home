const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const userRoutes = require("./routers/user")
const meterRoutes = require("./routers/meter .js")
const externalRoutes = require("./routers/external")

dotenv.config()
const app = express()
const { PORT = 3000, MONGODB_URL } = process.env

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (MONGODB_URL) {
  mongoose
    .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err.message))
}

app.use("/api/users", userRoutes)
app.use("/api/meters", meterRoutes)
app.use("/api/external", externalRoutes)

app.get("/", (req, res) => {
  res.json({ success: true, message: "Flock Energy API is running" })
})

app.listen(PORT, () => {
  console.log(`server is connected, ${PORT}`)
})