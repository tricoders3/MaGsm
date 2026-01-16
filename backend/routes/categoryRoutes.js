// routes/categoryRoutes.js
import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  removeSubCategory,
 getSubCategories 
} from "../controllers/categoryController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getCategories)
  .post(upload.single("image"), createCategory);
router.get("/:id/subcategories", getSubCategories);
router.route("/:id")
  .put(upload.single("image"), updateCategory)
  .delete(deleteCategory);
router.post("/:id/subcategory", addSubCategory);
router.route("/:categoryId/subcategories/:subId").delete(removeSubCategory);

export default router;
