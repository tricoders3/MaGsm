import express from "express";

import passport from "../passport.js"; 
import { register, login, googleLoginSuccess, logout } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// --------- Routes classiques ----------
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, (req, res) => res.json(req.user));

// --------- Google OAuth ----------
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/google/success",
    failureRedirect: "/login/failed",
  })
);

router.get("/google/success", googleLoginSuccess);

// --------- Déconnexion ----------
router.get("/logout", logout);

export default router;
