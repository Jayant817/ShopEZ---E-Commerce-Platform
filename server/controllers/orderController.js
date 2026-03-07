import Order from "../models/Order.js"

export const placeOrder = async (req, res) => {
  try {
    const order = new Order(req.body)
    await order.save()
    res.status(201).json({ success: true, data: order })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to place order", error: err.message })
  }
}

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: err.message })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: err.message })
  }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    res.json({ success: true, data: order })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update order", error: err.message })
  }
}