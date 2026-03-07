import express from "express"

import {
 createProduct,
 getProducts,
 getProductById,
 updateProduct,
 deleteProduct
} from "../controllers/productController.js"

import {verifyToken, verifyAdmin} from "../middleware/authMiddleware.js"

const router = express.Router()

/* ---------------- PUBLIC ROUTES ---------------- */

/* GET ALL PRODUCTS */
router.get("/", getProducts)

/* GET SINGLE PRODUCT */
router.get("/:id", getProductById)


/* ---------------- ADMIN ROUTES ---------------- */

/* ADD PRODUCT */
router.post("/", verifyToken, verifyAdmin, createProduct)

/* UPDATE PRODUCT */
router.put("/:id", verifyToken, verifyAdmin, updateProduct)

/* DELETE PRODUCT */
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct)

export default router