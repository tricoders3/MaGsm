import express from "express";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getBrands);
router.get("/:id", getBrandById);

router.post(
  "/",
  protect,
  upload.single("logo"), // 🔥 image
  createBrand
);

router.put(
  "/:id",
  protect,
  upload.single("logo"),
  updateBrand
);
router.delete("/:id", protect,  deleteBrand);

export default router;
