import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js"; // ton modèle User

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("20771717", 10); // mot de passe admin
    const admin = new User({
      name: "Admin",
      email: "magsm2077@gmail.com",
      password: hashedPassword,
      role: "admin",
      isApproved: true,   // ✅ admin approuvé
      createdAt: new Date(),
    });

    await admin.save();
    console.log("✅ Admin créé avec succès !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur :", err.message);
    process.exit(1);
  }
};

createAdmin();
