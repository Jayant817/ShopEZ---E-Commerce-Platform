import express from "express"
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js"
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js"

const router = express.Router()

/* PLACE ORDER — logged-in users only */
router.post("/", verifyToken, placeOrder)

/* GET ALL ORDERS — admin only */
router.get("/", verifyToken, verifyAdmin, getAllOrders)

/* GET ORDERS BY USER ID — logged-in users only */
router.get("/:userId", verifyToken, getUserOrders)

/* UPDATE ORDER STATUS — admin only */
router.put("/:id", verifyToken, verifyAdmin, updateOrderStatus)

export default router