import express from "express"
import User from "../models/User.js"
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js"

const router = express.Router()

/* GET ALL USERS — admin only, passwords excluded */
router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    // .select("-password") tells Mongoose to omit the password field
    const users = await User.find().select("-password")
    res.json({ success: true, data: users })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: err.message })
  }
})

export default router