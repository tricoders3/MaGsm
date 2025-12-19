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

const router = express.Router();

router.route("/").get(getCategories).post(createCategory);
router.get("/:id/subcategories", getSubCategories);
router.route("/:id").put(updateCategory).delete(deleteCategory);
router.post("/:id/subcategory", addSubCategory);
router.route("/:categoryId/subcategories/:subId").delete(removeSubCategory);

export default router;
