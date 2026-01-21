import Product from "../models/productModel.js"
import Order from "../models/orderModel.js";
import Promotion from "../models/Promotion.js";
import { model } from "mongoose";
import cloudinary from "../config/cloudinary.js";

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (admin)
 */
export const createProduct = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      imageUrl = result.secure_url;
    }

    const product = new Product({
      ...req.body,
      images: imageUrl ? [{ url: imageUrl }] : [],
    });
 let stockStatus = req.body.countInStock;
    if (!["in", "out"].includes(stockStatus)) {
      stockStatus = "in";}
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};



/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = async (req, res) => {
  try {
    // 1️⃣ Get all products and populate category & promotion
    const products = await Product.find()
      .populate("category", "name subCategories")
      .populate("promotion"); // populate promotion if exists

    const result = products.map((p) => {
      // 2️⃣ Get subCategory name from category.subCategories
      const subCat = p.category?.subCategories.find(
        (sc) => sc._id.toString() === p.subCategory?.toString()
      );

      // 3️⃣ Prepare promotion info only if exists
      const promoInfo = p.promotion
        ? {
            _id: p.promotion._id,
            name: p.promotion.name,
            discountType: p.promotion.discountType,
            discountValue: p.promotion.discountValue,
            startDate: p.promotion.startDate,
            endDate: p.promotion.endDate,
            isActive: p.promotion.isActive,
          }
        : null;

      return {
        ...p._doc,
        subCategoryName: subCat ? subCat.name : null,
        promotion: promoInfo,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};



/**
 * @desc    Get product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
     .populate("category", "name subCategories"); 

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private (admin)
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // update fields
    product.name = req.body.name || product.name;
    product.model = req.body.model || product.model;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.subCategory = req.body.subCategory || product.subCategory;
    product.description = req.body.description || product.description;
    product.price = req.body.price ?? product.price;

    // validate stock status
    if (req.body.countInStock && ["in", "out"].includes(req.body.countInStock)) {
      product.countInStock = req.body.countInStock;
    }

    // handle image
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      });
      product.images = [{ url: result.secure_url }];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
};


/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (admin)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:categoryId
 * @access  Public
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
    }).populate("category", "name subCategories")
     .populate("promotion");

    // Map subCategory id to name
    const result = products.map((p) => {
      const subCat = p.category.subCategories.find(
        (sc) => sc._id.toString() === p.subCategory.toString()
      );
      return {
        ...p._doc,
        subCategoryName: subCat ? subCat.name : null,
        promotion: p.promotion || null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products by category" });
  }
};

/**
 * @desc    Get products by subCategory
 * @route   GET /api/products/subcategory/:subCategoryId
 * @access  Public
 */
export const getProductsBySubCategory = async (req, res) => {
  try {
    // Find all products
    const products = await Product.find().populate("category", "name subCategories")
    .populate("promotion"); ;

    // Filter by subCategory id
    const filtered = products.filter(
      (p) => p.subCategory.toString() === req.params.subCategoryId
    ).map((p) => {
      const subCat = p.category.subCategories.find(
        (sc) => sc._id.toString() === p.subCategory.toString()
      );
      return {
        ...p._doc,
        subCategoryName: subCat ? subCat.name : null,
        promotion: p.promotion || null,
      };
    });

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products by subCategory" });
  }
};
export  const getBestSellingProducts = async (req, res) => {
  try {
    // Aggregate quantity sold per product
    const sales = await Order.aggregate([
      { $unwind: "$orderItems" }, // Flatten orderItems
      {
        $group: {
          _id: "$orderItems.product", // Group by product ID
          totalSold: { $sum: "$orderItems.qty" } // Sum quantities
        }
      },
      { $sort: { totalSold: -1 } }, // Sort descending
      { $limit: 5 } // Top 5
    ]);

    // Get product details
    const productIds = sales.map(s => s._id);
    const products = await Product.find({ _id: { $in: productIds } })
      .populate("category", "name subCategories")
      .populate("subCategory", "name");

    // Merge totalSold into product objects
    const result = products.map(p => {
      const sale = sales.find(s => s._id.toString() === p._id.toString());
      return { ...p._doc, totalSold: sale ? sale.totalSold : 0 };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching best-selling products" });
  }
};














// Get all distinct brands
export const getBrands = async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    const filter = {};

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }
    if (subCategory && mongoose.Types.ObjectId.isValid(subCategory)) {
      filter.subCategory = subCategory;
    }

    const brands = await Product.distinct("brand", filter);

    res.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Error fetching brands", error: error.message });
  }
};




