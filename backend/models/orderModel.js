// models/Order.js
import mongoose from "mongoose"

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
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // snapshot
      },
    ],

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
