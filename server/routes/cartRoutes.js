import express from "express"
import { addToCart, getCart, removeCartItem, clearCart, updateCartItem } from "../controllers/cartController.js"
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router()

// All cart routes require a logged-in user
router.use(verifyToken)

/* ADD TO CART */
router.post("/", addToCart)

/* GET USER CART */
router.get("/:userId", getCart)

router.put("/:id", updateCartItem)

/* CLEAR CART — must come BEFORE /:id, otherwise Express reads "clear" as a cart item id */
router.delete("/clear/:userId", clearCart)

/* REMOVE SINGLE ITEM */
router.delete("/:id", removeCartItem)

export default router