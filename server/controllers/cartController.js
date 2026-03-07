import Cart from "../models/Cart.js"

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, size, quantity } = req.body

    // Check if this exact product+size combo already exists in the user's cart
    const existing = await Cart.findOne({ userId, productId, size })

    if (existing) {
      // Increment quantity instead of creating a duplicate entry
      existing.quantity += quantity || 1
      await existing.save()
      return res.json({ success: true, data: existing })
    }

    const cartItem = new Cart({ userId, productId, size, quantity: quantity || 1 })
    await cartItem.save()

    res.status(201).json({ success: true, data: cartItem })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add to cart", error: err.message })
  }
}

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId }).populate("productId")
    res.json({ success: true, data: cart })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch cart", error: err.message })
  }
}

export const removeCartItem = async (req, res) => {
  try {
    const item = await Cart.findByIdAndDelete(req.params.id)

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" })
    }

    res.json({ success: true, message: "Item removed from cart" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to remove item", error: err.message })
  }
}

export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.params.userId })
    res.json({ success: true, message: "Cart cleared" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to clear cart", error: err.message })
  }
}

export const updateCartItem = async (req, res) => {
  try {
    const item = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    )
    if (!item) return res.status(404).json({ success: false, message: "Item not found" })
    res.json({ success: true, data: item })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update item", error: err.message })
  }
}