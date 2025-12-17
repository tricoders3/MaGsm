// controllers/authController.js
import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../services/authService.js";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

/**
 * Inscription d'un utilisateur classique (email / mot de passe)
 */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création de l'utilisateur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "client",
    });

    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};
/**
 * Connexion classique (email / mot de passe)
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // +password لأن password في schema select: false
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // مقارنة كلمة السر
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // إنشاء JWT
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // إرسال الكوكي و JSON
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .json({
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Vérifie si l'utilisateur est connecté via Google OAuth
 */
export const googleLoginSuccess = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user;

  // Inclure name, email, picture dans le token
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      picture: user.picture || null, // si tu as un champ photo
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.redirect(`${process.env.CLIENT_URL}/oauth-success?token=${accessToken}`);
};

/**
 * Déconnexion
 */
export const logout = (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).json({ message: "Erreur lors de la déconnexion" });
    res.clearCookie("refreshToken");
    res.redirect(process.env.CLIENT_URL); // Redirige vers le frontend
  });
};
