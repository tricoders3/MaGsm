import express from "express"
import {
  getContent,
  updateHome,
  updateBanner,
  updateAbout,
  updateContact,
  updateOffers,
} from "../controllers/siteSettingsController.js"

import { protect, isAdmin } from "../middlewares/authMiddleware.js"

const router = express.Router()

// PUBLIC
router.get("/", getContent)

// ADMIN
router.put("/home", protect, isAdmin, updateHome)
router.put("/banner", protect, isAdmin, updateBanner)
router.put("/about", protect, isAdmin, updateAbout)
router.put("/contact", protect, isAdmin, updateContact)
router.put("/offers", protect, isAdmin, updateOffers)

export default router
