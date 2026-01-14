import express from "express"
import { protect, isAdmin } from "../middlewares/authMiddleware.js"
import {
  createOrderFromCart,
  getOrdersForUser,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../controllers/orderController.js"

const router = express.Router()

// USER
router.post("/", protect, createOrderFromCart)
router.get("/my", protect, getOrdersForUser)

// ADMIN
router.get("/", protect, getAllOrdersAdmin)
router.put("/:id/status", protect, updateOrderStatusAdmin)


export default router
