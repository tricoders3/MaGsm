// backend/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // Lire le token depuis le cookie
  const token = req.cookies.refreshToken; // 🔹 ton cookie s'appelle refreshToken
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    return res.sendStatus(403);
  }
};
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
};
