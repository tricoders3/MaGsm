import { getUserCart, clearCart } from "../services/cartService.js"
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} from "../services/orderService.js"
import { sendAdminOrderNotification } from "../utils/sendEmail.js"

// CREATE ORDER FROM CART
export const createOrderFromCart = async (req, res) => {
  try {
    const cart = await getUserCart(req.user.id)

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Panier vide" })
    }

    // 1️⃣ créer la commande
    const order = await createOrder(req.user, cart)

    // 2️⃣ envoyer mail admin (non bloquant)
    try {
      await sendAdminOrderNotification({
        user: req.user,
        order,
      })
    } catch (mailError) {
      console.error("Erreur email admin:", mailError.message)
    }

    // 3️⃣ vider le panier
    await clearCart(req.user.id)

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// USER – GET HIS ORDERS
export const getOrdersForUser = async (req, res) => {
  try {
    const orders = await getOrdersByUser(req.user.id)
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ADMIN – GET ALL ORDERS
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await getAllOrders()
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ADMIN – UPDATE ORDER STATUS
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { status } = req.body
    const orderId = req.params.id

    const order = await updateOrderStatus(orderId, status)

    res.status(200).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
