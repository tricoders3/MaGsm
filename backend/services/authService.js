import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email déjà utilisé");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: "client",
  });

  await newUser.save();
  return newUser;
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
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { accessToken, refreshToken };
};
export const facebookLogin = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);  
  return { accessToken, refreshToken };
};

/**
 * 🔹 Update password (LOCAL users only)
 */
export const updateUserPassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("Utilisateur non trouvé");

  if (user.provider !== "local") {
    throw new Error("Connexion sociale : création du mot de passe requise");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Mot de passe actuel incorrect");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.passwordCreated = true;

  await user.save();
  return true;
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
