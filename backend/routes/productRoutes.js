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



router
  .route("/")
  .get(getProducts)
  .post(upload.single("image"), createProduct); // ✅ image from device

/**
 * @route   GET /api/products/:id
 * @route   PUT /api/products/:id
 * @route   DELETE /api/products/:id
 */
router
  .route("/:id")
  .get(getProductById)
  .put(upload.single("image"), updateProduct) // ✅ image update
  .delete(deleteProduct);

/**
 * Other routes
 */

router.get("/category/:categoryId", getProductsByCategory);
router.get("/subcategory/:subCategoryId", getProductsBySubCategory);
router.get("/best-selling", getBestSellingProducts);





router.get("/brands", getBrands);

export default router;
