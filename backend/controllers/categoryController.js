// controllers/categoryController.js
import Category from "../models/CategoryModels.js";

/**
 * @desc    Get all categories with subCategories
 * @route   GET /api/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private
 */
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = new Category({ name, subCategories: [] });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating category" });
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private
 */
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.name = req.body.name || category.name;
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Error updating category" });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category" });
  }
};

/**
 * @desc    Add subCategory to a category
 * @route   POST /api/categories/:id/subcategories
 * @access  Private
 */
export const addSubCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Add the new subcategory
    category.subCategories.push({ name: req.body.name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding subCategory" });
  }
};

/**
 * @desc    Remove subCategory from a category
 * @route   DELETE /api/categories/:categoryId/subcategories/:subId
 * @access  Private
 */
export const removeSubCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.subCategories = category.subCategories.filter(
      (sub) => sub._id.toString() !== req.params.subId
    );
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error removing subCategory" });
  }
};
