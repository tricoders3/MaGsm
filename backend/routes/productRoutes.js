import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySubCategory,getBestSellingProducts
} from "../controllers/productController.js";


const router = express.Router();

router.route("/")
  .get(getProducts)
  .post( createProduct);

router.route("/:id")
  .get(getProductById)
  .put( updateProduct)
  .delete( deleteProduct);

router.get("/category/:categoryId", getProductsByCategory);
router.get("/subcategory/:subCategoryId", getProductsBySubCategory);
router.get("/best-selling", getBestSellingProducts);
export default router;
