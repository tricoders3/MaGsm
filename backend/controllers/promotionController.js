// controllers/promotionController.js
import Product from "../models/productModel.js";
import Promotion from "../models/Promotion.js";

/**
 * @desc Apply promotion to products (all, category, subCategory, or brand)
 * @route POST /api/promotions/apply
 * @access Private (admin)
 */

export const applyPromotion = async (req, res) => {
  try {
    let {
      name,
      
      discountType,
      discountValue,
      category,
      subCategory,
      brand,
      startDate,
      endDate,
    } = req.body;

    // Convert empty strings to null
    category = category || null;
    subCategory = subCategory || null;
    brand = brand || null;

    if (!name || !discountType || discountValue == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Create the promotion
    const promotion = await Promotion.create({
      name,
      description: req.body.description || "",
      discountType,
      discountValue,
      category,
      subCategory,
      brand,
      startDate,
      endDate,
      isActive: true,
    });

    // 2️⃣ Build filter to select products to apply the promotion
    const filter = {};
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (brand) filter.brand = brand;

    // 3️⃣ Update products to reference this promotion
    const result = await Product.updateMany(filter, {
      $set: { promotion: promotion._id },
    });

    res.json({
      message: "Promotion applied to products successfully",
      promotion,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Apply promotion error:", error);
    res.status(500).json({ message: error.message });
  }
};




/**
 * @desc    Remove a promotion: deactivate it and remove it from all products
 * @route   DELETE /api/promotions/:id
 * @access  Private (admin)
 */
export const removePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Deactivate the promotion instead of deleting
    const promo = await Promotion.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!promo) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    console.log(`Promotion ${id} set to inactive.`);

    // 2️⃣ Remove this promotion reference from all products
    const result = await Product.updateMany(
      { promotion: id },
      { $set: { promotion: null } }
    );

    console.log(
      `Promotion removed from ${result.modifiedCount} products.`
    );

    res.json({
      message: "Promotion deleted and removed from products",
      promotion: promo,
      updatedProducts: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error removing promotion:", error);
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc Get all active promotions
 * @route GET /api/promotions/active
 * @access Public
 */
export const getActivePromotions = async (req, res) => {
 try {
    const promotions = await Promotion.find()
        .where("isActive").equals(true)

    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    let { category, subCategory,description, ...payload } = req.body;

    // Convert empty strings to null
    if (category === "") category = null;
    if (subCategory === "") subCategory = null;

    const updatedPromotion = await Promotion.findByIdAndUpdate(
      id,
      { ...payload, category, subCategory,description  },
      { new: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.json(updatedPromotion);
  } catch (error) {
    console.error("Error updating promotion:", error.message);
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc    Get products with an active promotion
 * @route   GET /api/promotions/promos
 * @access  Public
 */
export const getProductsWithPromo = async (req, res) => {
  try {
    // Step 1: Find all products with a promotion assigned
    const products = await Product.find({ promotion: { $ne: null } })
      .populate("promotion") // populate promotion document
      .populate("category", "name subCategories"); // get category and embedded subCategories

    // Step 2: Filter only products whose promotion isActive === true
    const activeProducts = products
      .filter((p) => p.promotion && p.promotion.isActive)
      .map((p) => {
        // get subCategory name
        let subCategoryName = null;
        if (p.category && p.subCategory) {
          const subCat = p.category.subCategories.find(
            (sc) => sc._id.toString() === p.subCategory.toString()
          );
          subCategoryName = subCat ? subCat.name : null;
        }

        const promo = p.promotion;

        // Calculate discounted price
        const originalPrice = p.price;
        let discountedPrice = originalPrice;
        if (promo.discountType === "percentage") {
          discountedPrice = originalPrice - (originalPrice * promo.discountValue) / 100;
        } else if (promo.discountType === "fixed") {
          discountedPrice = originalPrice - promo.discountValue;
        }
        discountedPrice = Math.max(discountedPrice, 0);

        return {
          _id: p._id,
          name: p.name,
          image: p.images?.[0]?.url || "",
          originalPrice,
          discountedPrice,
          promotion: {
            _id: promo._id,
            name: promo.name,
            description: promo.description,
            discountType: promo.discountType,
            discountValue: promo.discountValue,
            isActive: promo.isActive,
            startDate: promo.startDate,
            endDate: promo.endDate,
          },
          category: p.category?.name || "",
          subCategory: subCategoryName,
        };
      });

    console.log("Products with active promotion:", activeProducts.length);
    res.json(activeProducts);
  } catch (error) {
    console.error("Error fetching products with promotion:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get the promotion for a single product by productId
 * @route   GET /api/promotions/product/:productId
 * @access  Public
 */
export const getPromotionByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product and populate promotion
    const product = await Product.findById(productId).populate("promotion");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.promotion || !product.promotion.isActive) {
      return res.json({ promotion: null });
    }

    const promo = product.promotion;

    // Calculate discounted price
    const originalPrice = product.price;
    let discountedPrice = originalPrice;

    if (promo.discountType === "percentage") {
      discountedPrice = originalPrice - (originalPrice * promo.discountValue) / 100;
    } else if (promo.discountType === "fixed") {
      discountedPrice = originalPrice - promo.discountValue;
    }
    discountedPrice = Math.max(discountedPrice, 0);

    res.json({
      productId: product._id,
      originalPrice,
      discountedPrice,
      promotion: {
        _id: promo._id,
        name: promo.name,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        startDate: promo.startDate,
        endDate: promo.endDate,
        isActive: promo.isActive,
      },
    });
  } catch (error) {
    console.error("Error fetching product promotion:", error);
    res.status(500).json({ message: error.message });
  }
};