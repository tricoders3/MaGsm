// models/Order.js
import mongoose from "mongoose"
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, default: "Tunisie" }
});
const billingDetailsSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

   items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,   // 🔥 C'EST ÇA QUI MANQUAIT
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
],
    shippingAddress: { type: addressSchema },
    billingDetails: billingDetailsSchema,
    discount: { type: Number, default: 0 },      // remise appliquée (DT)
    pointsUsed: { type: Number, default: 0 },    // points consommés
    deliveryFee: { type: Number, default: 8 },
    subTotal: { type: Number, required: true },
    total: { type: Number, required: true },
    pointsEarned: { type: Number, default: 0 }, // points gagnés sur cette commande
    status: {
      type: String,
      enum: ["en attente", "livré", "annulé"],
      default: "en attente",
    },
  },
  
  { timestamps: true }
)

export default mongoose.model("Order", orderSchema)
