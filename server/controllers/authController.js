import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { username, password } = req.body
    const email = req.body.email?.toLowerCase().trim() // normalize email

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" })
    }

    // Check if email already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" })
    }

    const hashed = await bcrypt.hash(password, 10)

    // usertype is NOT taken from the request body — all new users are Customers
    const user = new User({ username, email, password: hashed, usertype: "Customer" })

    await user.save()

    res.status(201).json({ success: true, message: "Registration successful" })

  } catch (err) {
    res.status(500).json({ success: false, message: "Registration failed", error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { password } = req.body
    const email = req.body.email?.toLowerCase().trim() // normalize so TEST@gmail.com == test@gmail.com

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ success: false, message: "User not found" })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(400).json({ success: false, message: "Invalid password" })

    const token = jwt.sign(
      { id: user._id, usertype: user.usertype },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }  // Token expires in 7 days — was never expiring before
    )

    // Destructure out the password so it's never sent to the client
    const { password: _pw, ...safeUser } = user.toObject()

    res.json({ success: true, token, user: safeUser })

  } catch (err) {
    res.status(500).json({ success: false, message: "Login failed", error: err.message })
  }
}