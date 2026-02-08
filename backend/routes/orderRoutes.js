import express from "express"
import { protect, isAdmin } from "../middlewares/authMiddleware.js"
import {
  createOrderFromCart,
  getOrdersForUser,
  getAllOrdersAdmin,
  updateOrderStatusAdmin, deleteAllOrdersAdmin, deleteOrderAdmin
} from "../controllers/orderController.js"

const router = express.Router()

// USER
router.post("/", protect, createOrderFromCart)

router.get("/my", protect, getOrdersForUser)

// ADMIN
router.get("/", protect, getAllOrdersAdmin)

router.put("/:id/status", protect, updateOrderStatusAdmin)
router.delete("/:id", protect, deleteOrderAdmin) // delete single order
router.delete("/", protect, deleteAllOrdersAdmin) // delete all orders


export default router
