// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["client", "admin"], default: "client" },
 

    // Google
    googleId: { type: String, unique: true, sparse: true },
    provider: { type: String, default: "local" },
    facebookId: { type: String, unique: true, sparse: true },


    refreshToken: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
