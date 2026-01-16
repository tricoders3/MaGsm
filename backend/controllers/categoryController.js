// controllers/categoryController.js
import Category from "../models/CategoryModels.js";
import cloudinary from "../config/cloudinary.js";

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

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const category = new Category({
      name,
      subCategories: [],
      image: req.file.path,
    });

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

    // Update name
    category.name = req.body.name || category.name;

    // Update image if a new file is uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (category.image) {
        try {
          const urlParts = category.image.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `categories/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Failed to delete old image from Cloudinary", err);
        }
      }

      category.image = req.file.path;
    }

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

    // Delete image from Cloudinary
    if (category.image) {
      try {
        const urlParts = category.image.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `categories/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Failed to delete image from Cloudinary", err);
      }
    }

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


/**
 * @desc    Get subCategories of a category
 * @route   GET /api/categories/:id/subcategories
 * @access  Public
 */
export const getSubCategories = async (req, res) => {
  try {
    // Find category by ID and select only the subCategories field
    const category = await Category.findById(req.params.id, "subCategories");
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Return only the subCategories array
    res.json(category.subCategories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching subCategories" });
  }
};

/**
 * @desc    Get subCategory names of a category
 * @route   GET /api/categories/:id/subcategories/names
 * @access  Public
 */


export const getProductsBySubCategory = async (req, res) => {
  try {
    // Find all products that belong to the subCategory
    const products = await Product.find({ subCategory: req.params.subCategoryId })
      .populate("category", "name subCategories"); // populate category info

    // Map subCategory id to name
    const result = products.map((p) => {
      const subCat = p.category.subCategories.find(
        (sc) => sc._id.toString() === p.subCategory.toString()
      );
      return {
        ...p._doc,
        subCategoryName: subCat ? subCat.name : null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products by subCategory" });
  }
};