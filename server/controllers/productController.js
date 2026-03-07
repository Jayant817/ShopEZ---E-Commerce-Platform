import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json({ success: true, data: product })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to create product", error: err.message })
  }
}

export const getProducts = async (req, res) => {
  try {
    // Support optional category filter: GET /api/products?category=fashion
    const filter = req.query.category
  ? { category: { $regex: new RegExp(`^${req.query.category}$`, "i") } }
  : {}
    const products = await Product.find(filter)
    res.json({ success: true, data: products })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products", error: err.message })
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    // Properly handle not found instead of returning null with 200 OK
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({ success: true, data: product })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch product", error: err.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({ success: true, data: product })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update product", error: err.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" })
    }

    res.json({ success: true, message: "Product deleted successfully" })
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete product", error: err.message })
  }
}