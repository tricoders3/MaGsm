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
router.put("/home", protect, updateHome)
router.put("/banner", protect, updateBanner)
router.put("/about", protect, updateAbout)
router.put("/contact", protect, updateContact)
router.put("/offers", protect, updateOffers)

export default router
