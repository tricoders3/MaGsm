// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["guest", "client", "admin"], default: "guest" },
    isApproved: { type: Boolean, default: false },
    pendingRequest: { type: Boolean, default: false },
   // 🔹 Permet de savoir si un password local existe
    passwordCreated: {
      type: Boolean,
      default: false,
    },
    loyaltyPoints: { type: Number, default: 0 }, // <- points fidélité
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    favorites: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
],
 

    // Google
    googleId: { type: String, unique: true, sparse: true },
    provider: {
    type: String,
    enum: ["local", "google", "facebook"],
    default: "local",
  },
    facebookId: { type: String, unique: true, sparse: true },


    refreshToken: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
