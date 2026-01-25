import Order from "../models/orderModel.js";
import { calculateLoyaltyPoints } from "../utils/loyalty.js";

// CREATE ORDER
export const createOrder = async (user, cart, shippingAddress) => {
  const items = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 🔥 calcul des points gagnés ICI
  const pointsEarned = calculateLoyaltyPoints(total);

  return await Order.create({
    user: user.id,
    items,
    shippingAddress, 
    total,
    pointsEarned, // ✅ sauvegardé directement
  });
};
// GET USER ORDERS
export const getOrdersByUser = async (userId) => {
  return await Order.find({ user: userId }).populate("items.product")
}
// ADMIN
export const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "name email")
    .populate("items.product")
    .sort({ createdAt: -1 })
}

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId)

  if (!order) {
    throw new Error("Commande introuvable")
  }

  order.status = status
  await order.save()

  return order
}
// Supprimer une seule commande
export const deleteOrderById = async (orderId) => {
  const order = await Order.findByIdAndDelete(orderId);
  return order; // retourne null si non trouvé
}

// Supprimer toutes les commandes
export const deleteAllOrders = async () => {
  const result = await Order.deleteMany({});
  return result; // result.deletedCount = nombre de documents supprimés
}