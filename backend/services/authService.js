import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { sendAdminRequestEmail, sendApprovalEmail } from "../utils/sendEmail.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email déjà utilisé");

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("Creating user in DB...");
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "guest",
    isApproved: false,
    pendingRequest: true
  });
  console.log("User created:", user.email);

  try {
    console.log("Sending email to admin...");
    //await sendAdminRequestEmail(user);
    console.log("Email sent to admin");
  } catch (err) {
    console.error("Email error:", err);
  }

  return user;
};



export const approveUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");
  if (!user.pendingRequest) throw new Error("Aucune demande en attente");

  user.pendingRequest = false;
  user.isApproved = true;
  user.role = "client";
  user.loyaltyPoints = 100; // Bonus de bienvenue
  await user.save();

  // Email pour prévenir l'utilisateur
  await sendApprovalEmail(user.email, user.name);

  return user;
};
/**
 * Récupère toutes les demandes d'accès en attente
 */
export const getPendingRequestsService = async () => {
  const requests = await User.find({ isApproved: false, pendingRequest: true });
  return requests;
};
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

export const googleLogin = async (user) => {
  // ⛔ utilisateur pas encore approuvé
  if (!user.isApproved) {
    // envoyer email admin UNIQUEMENT à la première fois
    if (!user.pendingRequest) {
      await sendAdminRequestEmail(user);

      user.pendingRequest = true;
      await user.save();
    }

    throw new Error("ACCOUNT_NOT_APPROVED");
  }

  // ✅ approuvé
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

export const facebookLogin = async (user) => {
  if (!user.isApproved) {
    if (!user.pendingRequest) {
      await sendAdminRequestEmail(user);

      user.pendingRequest = true;
      await user.save();
    }

    throw new Error("ACCOUNT_NOT_APPROVED");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

/**
 * 🔹 Update password (LOCAL users only)
 */
export const updateUserPassword = async (userId, currentPassword, newPassword) => {
  // 1️⃣ Find user
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("Utilisateur non trouvé");

  // 2️⃣ Local user: check current password
  if (user.provider === "local") {
    if (!currentPassword) throw new Error("Veuillez fournir le mot de passe actuel");

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new Error("Mot de passe actuel incorrect");
  }

  // 3️⃣ Hash the new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.passwordCreated = true;

  // 4️⃣ Save user
  await user.save();

  return true; // ✅ password updated
};


/**
 * 🔹 Create password for SOCIAL user
 */
export const createPasswordForSocialUser = async (userId, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Utilisateur non trouvé");

  if (user.passwordCreated) {
    throw new Error("Mot de passe déjà créé");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.provider = "local";
  user.passwordCreated = true;

  await user.save();
  return true;
};

/**
 * 🔹 Generate reset password token (ALL users)
 */
export const generatePasswordResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Utilisateur non trouvé");

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();
  return resetToken;
};

/**
 * 🔹 Reset password (ALL users)
 */
export const resetUserPassword = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) throw new Error("Token invalide ou expiré");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.provider = "local";
  user.passwordCreated = true;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  return true;
};