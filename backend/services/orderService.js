import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import { calculateLoyaltyPoints } from "../utils/loyalty.js";


// CREATE ORDER
export const createOrder = async (
  user,
  cart,
  billingDetails,
  shippingAddress,
  useLoyaltyPoints = false
) => {
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new Error("Panier vide");
  }

  // ✅ Charger le vrai user MongoDB
  const dbUser = await User.findById(user.id);
  if (!dbUser) {
    throw new Error("Utilisateur introuvable");
  }

  // 🔹 Items
  const items = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name, 
    price: item.price ?? item.product.price,
    quantity: item.quantity,
  }));
  

  // 🔹 Sous-total
  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee = 7;

  // 🔹 Gestion points → remise
  let discount = 0;
  let pointsUsed = 0;

  if (useLoyaltyPoints && dbUser.loyaltyPoints >= 1000) {
    // règle : 1000 pts = 10 DT
    const maxDiscount = Math.floor(dbUser.loyaltyPoints / 1000) * 10;

    discount = Math.min(maxDiscount, subTotal);
    pointsUsed = Math.floor(discount / 10) * 1000;

    // 🔻 Déduction des points
    dbUser.loyaltyPoints -= pointsUsed;
  }

  // 🔹 Total final
  const total = subTotal + deliveryFee - discount;

  // 🔹 Points gagnés
  const pointsEarned = calculateLoyaltyPoints(total);

  // 🔹 Ajouter les points gagnés
  dbUser.loyaltyPoints += pointsEarned;

  // 🔹 Sauvegarde UNIQUE du user
  await dbUser.save();

  // 🔹 Créer la commande (snapshot)
  const order = await Order.create({
    user: dbUser._id,
    billingDetails,
    shippingAddress,
    items,
    subTotal,
    deliveryFee,
    discount,
    pointsUsed,
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