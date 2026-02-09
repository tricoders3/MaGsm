import { getUserCart, clearCart } from "../services/cartService.js"
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus, deleteOrderById, deleteAllOrders
} from "../services/orderService.js"
import { sendAdminOrderNotification , sendClientOrderConfirmation} from "../utils/sendEmail.js"
import { calculateLoyaltyPoints,applyLoyaltyPoints } from "../utils/loyalty.js"
import User from "../models/userModel.js"
import { generateInvoicePDF } from "../utils/generateInvoice.js";

// CREATE ORDER FROM CART
export const createOrderFromCart = async (req, res) => {
  try {
    const cart = await getUserCart(req.user.id);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Panier vide" });
    }

    const { shippingAddress, billingDetails, useLoyaltyPoints } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Adresse de livraison requise" });
    }

    if (!billingDetails) {
      return res.status(400).json({ message: "Détails de facturation requis" });
    }

    // 1️⃣ Create order
    const order = await createOrder(
      req.user,
      cart,
      billingDetails,
      shippingAddress,
      useLoyaltyPoints
    );
const user = await User.findById(req.user.id).select("name email phone loyaltyPoints");


    // 2️⃣ Clear cart
    await clearCart(req.user.id);

    // 3️⃣ SEND RESPONSE IMMEDIATELY 🔥
    res.status(201).json({
      message: "Commande créée avec succès",
      order,
      loyaltyPoints: user.loyaltyPoints,
    });

    // 4️⃣ BACKGROUND TASK (PDF + EMAILS)
    setImmediate(async () => {
      try {
        let invoiceBuffer = null;

        try {
          invoiceBuffer = await generateInvoicePDF(order, user); // ✅ BUFFER
        } catch (pdfError) {
          console.error("PDF ERROR:", pdfError.message);
        }

        await sendAdminOrderNotification({ user, order });

        await sendClientOrderConfirmation({
          user,
          order,
          invoiceBuffer, // ✅ buffer not path
        });

        console.log("✅ Order emails sent");
      } catch (err) {
        console.error("BACKGROUND ERROR:", err);
      }
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};


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
// ADMIN – DELETE SINGLE ORDER
export const deleteOrderAdmin = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deletedOrder = await deleteOrderById(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    res.status(200).json({ message: "Commande supprimée avec succès", deletedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ADMIN – DELETE ALL ORDERS
export const deleteAllOrdersAdmin = async (req, res) => {
  try {
    const result = await deleteAllOrders();
    res.status(200).json({ message: "Toutes les commandes ont été supprimées", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
