import Order from "../models/orderModel.js";
import { calculateLoyaltyPoints } from "../utils/loyalty.js";

// CREATE ORDER
export const createOrder = async (user, cart, billingDetails, shippingAddress) => {
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Panier vide");
  }

  // 🔹 Construire les items de commande
  const items = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  // 🔹 Calcul du sous-total
  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🔹 Livraison
  const DELIVERY_FEE = 7;

  // 🔹 Total final
  const total = subTotal + DELIVERY_FEE;

  // 🔹 Points fidélité
  const pointsEarned = calculateLoyaltyPoints(subTotal);

  // ✅ Création de la commande (snapshot)
  const order = await Order.create({
    user: user.id,

    billingDetails: {
      name: billingDetails.name,
      email: billingDetails.email,
      phone: billingDetails.phone,
    },

    shippingAddress: {
      street: shippingAddress.street,
      postalCode: shippingAddress.postalCode,
      city: shippingAddress.city,
      region: shippingAddress.region,
      country: shippingAddress.country || "Tunisie",
    },

    items,
    subTotal,
    deliveryFee: DELIVERY_FEE,
    total,
    pointsEarned,
  });

  return order;
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