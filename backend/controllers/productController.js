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
    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        images.push({ url: result.secure_url });
      }
    }

    const product = new Product({
      ...req.body,
      images, // array of uploaded images
    });

    if (!["in", "out"].includes(req.body.countInStock)) {
      product.countInStock = "in";
    }

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
    // 1️⃣ Get all products with category & promotion
    const products = await Product.find()
      .populate("category", "name subCategories")
      .populate("promotion");

    const result = products.map((p) => {
      // 2️⃣ Resolve subCategory name
      const subCat = p.category?.subCategories.find(
        (sc) => sc._id.toString() === p.subCategory?.toString()
      );

      return {
        ...p._doc,

        // ✅ subCategory name
        subCategoryName: subCat ? subCat.name : null,

    

        // ✅ infos promo seulement si valide
        promotion: p.promotion?.isValid
          ? {
              _id: p.promotion._id,
              name: p.promotion.name,
              discountType: p.promotion.discountType,
              discountValue: p.promotion.discountValue,
              startDate: p.promotion.startDate,
              endDate: p.promotion.endDate,
                    // ✅ prix final calculé dynamiquement
        discountedPrice: p.getFinalPrice(),
            }
      
          : null,

        // ✅ flag simple pour le frontend
        hasPromotion: !!p.promotion?.isValid,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("getProducts error:", error);
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
      .populate("category", "name subCategories")
      .populate("promotion");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const subCat = product.category?.subCategories.find(
      (sc) => sc._id.toString() === product.subCategory?.toString()
    );

    res.json({
      ...product._doc,
      subCategoryName: subCat ? subCat.name : null,
      promotion: p.promotion?.isValid
          ? {
              _id: p.promotion._id,
              name: p.promotion.name,
              discountType: p.promotion.discountType,
              discountValue: p.promotion.discountValue,
              startDate: p.promotion.startDate,
              endDate: p.promotion.endDate,
                    // ✅ prix final calculé dynamiquement
        discountedPrice: p.getFinalPrice(),
            }
      
          : null,
      hasPromotion: !!product.promotion?.isValid,
    });
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

    // Update fields
    product.name = req.body.name || product.name;
    product.model = req.body.model || product.model;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.subCategory = req.body.subCategory || product.subCategory;
    product.description = req.body.description || product.description;
    product.price = req.body.price ?? product.price;

    // Validate stock status
    if (req.body.countInStock && ["in", "out"].includes(req.body.countInStock)) {
      product.countInStock = req.body.countInStock;
    }

    // Handle multiple images
    if (req.files && req.files.length > 0) {
      const images = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        images.push({ url: result.secure_url });
      }
      product.images = images; // Replace with new images
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
    })
      .populate("category", "name subCategories")
      .populate("promotion");

    const result = products.map((p) => {
      const subCat = p.category?.subCategories.find(
        (sc) => sc._id.toString() === p.subCategory?.toString()
      );

      return {
        ...p._doc,
        subCategoryName: subCat ? subCat.name : null,
     promotion: p.promotion?.isValid
          ? {
              _id: p.promotion._id,
              name: p.promotion.name,
              discountType: p.promotion.discountType,
              discountValue: p.promotion.discountValue,
              startDate: p.promotion.startDate,
              endDate: p.promotion.endDate,
                    // ✅ prix final calculé dynamiquement
        discountedPrice: p.getFinalPrice(),
            }
      
          : null,
        hasPromotion: !!p.promotion?.isValid,
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
    const products = await Product.find({
      subCategory: req.params.subCategoryId,
    })
      .populate("category", "name subCategories")
      .populate("promotion");

    const result = products.map((p) => {
      const subCat = p.category?.subCategories.find(
        (sc) => sc._id.toString() === p.subCategory?.toString()
      );

      return {
        ...p._doc,
        subCategoryName: subCat ? subCat.name : null,
         promotion: p.promotion?.isValid
          ? {
              _id: p.promotion._id,
              name: p.promotion.name,
              discountType: p.promotion.discountType,
              discountValue: p.promotion.discountValue,
              startDate: p.promotion.startDate,
              endDate: p.promotion.endDate,
                    // ✅ prix final calculé dynamiquement
        discountedPrice: p.getFinalPrice(),
            }
      
          : null,
        hasPromotion: !!p.promotion?.isValid,
      };
    });

    res.json(result);
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




/**
 * @desc    Get most purchased products
 * @route   GET /api/products/most-bought
 * @access  Public
 */
export const getMostPurchasedProducts = async (req, res) => {
  try {
    const limit = 10; // Always return top 10

    // 1️⃣ Aggregate sold quantities from orders
    const sales = await Order.aggregate([
      { $unwind: "$items" }, // Flatten items array
      {
        $group: {
          _id: "$items.product", // Group by product ID
          totalSold: { $sum: "$items.quantity" }, // Sum quantities
        },
      },
      { $sort: { totalSold: -1 } }, // Sort descending
      { $limit: limit }, // Limit top 10
    ]);

    // 2️⃣ Get full product details
    const productIds = sales.map(s => s._id);

    const products = await Product.find({ _id: { $in: productIds } })
      .populate("category", "name subCategories")
      .populate("promotion"); // Populate promotion if exists

    // 3️⃣ Merge totalSold and get subCategory name
    const popularProducts = products.map(p => {
      const sale = sales.find(s => s._id.toString() === p._id.toString());

      let subCategoryName = null;
      if (p.category && p.subCategory) {
        const subCat = p.category.subCategories.find(
          sc => sc._id.toString() === p.subCategory.toString()
        );
        subCategoryName = subCat ? subCat.name : null;
      }

      return {
        ...p._doc,
        totalSold: sale ? sale.totalSold : 0,
        subCategoryName,
        images: p.images || [], // return all images
        promotion: p.promotion?.isValid
          ? {
              _id: p.promotion._id,
              name: p.promotion.name,
              discountType: p.promotion.discountType,
              discountValue: p.promotion.discountValue,
              startDate: p.promotion.startDate,
              endDate: p.promotion.endDate,
                    // ✅ prix final calculé dynamiquement
        discountedPrice: p.getFinalPrice(),
            }
      
          : null,
        hasPromotion: !!p.promotion?.isValid,
      };
    });

    res.json(popularProducts);
  } catch (error) {
    console.error("Error fetching most purchased products:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductByName = async (req, res) => {
  try {
    const product = await Product.findOne({ name: req.params.name })
      .populate("category", "name subCategories")
      .populate("promotion");

    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    const subCat = product.category?.subCategories.find(
      (sc) => sc._id.toString() === product.subCategory?.toString()
    );

    res.json({
      ...product._doc,
      subCategoryName: subCat ? subCat.name : null,
     promotion: p.promotion?.isValid
          ? {
              _id: p.promotion._id,
              name: p.promotion.name,
              discountType: p.promotion.discountType,
              discountValue: p.promotion.discountValue,
              startDate: p.promotion.startDate,
              endDate: p.promotion.endDate,
                    // ✅ prix final calculé dynamiquement
        discountedPrice: p.getFinalPrice(),
            }
      
          : null,
      hasPromotion: !!product.promotion?.isValid,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
