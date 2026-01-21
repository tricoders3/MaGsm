import express from "express";
import passport from "passport";
import {
  register,
  login,
  logout,
  googleLoginSuccess,
  facebookLoginSuccess,updatePassword,
  forgotPassword, requestPriceAccess, approveUserByLink,
  resetPassword, createPassword
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ======================
   EMAIL / PASSWORD
====================== */
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, (req, res) => res.json(req.user));
router.post("/logout", logout);
// 🔐 Auth required
router.put("/update-password", protect, updatePassword);
router.put("/create-password", protect, createPassword);

// 🔓 Public
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.post("/request-access", protect, requestPriceAccess);
router.get("/approve-user/:userId", approveUserByLink);

/* ======================
   GOOGLE OAUTH
====================== */
// Start Google auth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: true, // keep true if you use sessions
  }),
  googleLoginSuccess
);

/* ======================
   FACEBOOK OAUTH
====================== */
// Start Facebook auth
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);

// Facebook callback

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: true }),
  facebookLoginSuccess
);

export default router;
