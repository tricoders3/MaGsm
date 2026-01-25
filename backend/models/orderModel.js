// models/Order.js
import mongoose from "mongoose"
const addressSchema = new mongoose.Schema({
  fullAddress: { type: String, required: true },
  street: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String },
  country: { type: String, default: "Tunisie" }
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
    total: { type: Number, required: true },
    pointsEarned: { type: Number, default: 0 }, // points gagnés sur cette commande
    status: {
      type: String,
      enum: ["pending","delivered","cancelled"],
      default: "pending",
    },
  },
  
  { timestamps: true }
)

export default mongoose.model("Order", orderSchema)
