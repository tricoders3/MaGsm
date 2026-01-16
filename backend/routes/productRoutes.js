import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySubCategory,
  getBestSellingProducts,
  getBrands
} from "../controllers/productController.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// ---------------- MAIN ROUTE ----------------
router
  .route("/")
  .get(getProducts)
  .post(upload.single("image"), createProduct); // single image from device

// ---------------- PRODUCT BY ID ----------------
router
  .route("/:id")
  .get(getProductById)
  .put(upload.single("image"), updateProduct) // single image update
  .delete(deleteProduct);

// ---------------- OTHER FILTERS ----------------
router.get("/category/:categoryId", getProductsByCategory);
router.get("/subcategory/:subCategoryId", getProductsBySubCategory);
router.get("/best-selling", getBestSellingProducts);
router.get("/brands", getBrands);

export default router;
