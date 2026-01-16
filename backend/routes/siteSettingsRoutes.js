import express from "express";
import {
  getContent,
  getHome,
  getBanner,
  getAbout,
  getContact,
  getOffers,
  updateHome,
  updateBanner,
  updateAbout,
  updateContact,
  updateOffers,
} from "../controllers/siteSettingsController.js";

import { protect, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getContent);
router.get("/home", getHome);
router.get("/banner", getBanner);
router.get("/about", getAbout);
router.get("/contact", getContact);
router.get("/offers", getOffers);

// ADMIN
router.put("/home", protect,updateHome);
router.put("/banner", protect, updateBanner);
router.put("/about", protect, updateAbout);
router.put("/contact", protect, updateContact);
router.put("/offers", protect,updateOffers);

export default router;
