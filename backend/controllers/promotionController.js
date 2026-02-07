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
      description,
      discountType,
      discountValue,
      category,
      subCategory,
      brand,
      productId, // 👈 NOUVEAU
      startDate,
      endDate,
    } = req.body;

    if (!name || !discountType || discountValue == null) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    // Convert empty strings to null
    category = category || null;
    subCategory = subCategory || null;
    brand = brand || null;
    productId = productId || null;

    // 1️⃣ Créer la promotion
    const promotion = await Promotion.create({
      name,
      description: description || "",
      discountType,
      discountValue,
      category,
      subCategory,
      brand,
      startDate,
      endDate,
      isActive: true,
    });

    // 2️⃣ Construire le filtre produit
    let filter = {};

    if (productId) {
      // 🎯 Promo pour UN seul produit
      filter._id = productId;
    } else {
      // 🎯 Promo globale
      if (category) filter.category = category;
      if (subCategory) filter.subCategory = subCategory;
      if (brand) filter.brand = brand;
    }

    // 3️⃣ Appliquer la promotion
    const result = await Product.updateMany(filter, {
      $set: { promotion: promotion._id },
    });

    res.json({
      message: "Promotion appliquée avec succès",
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

    let {
      name,
      description,
      discountType,
      discountValue,
      category,
      subCategory,
      brand,
      productId,
      startDate,
      endDate,
    } = req.body;

    if (!name || !discountType || discountValue == null) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    // Normalize empty values
    category = category || null;
    subCategory = subCategory || null;
    brand = brand || null;
    productId = productId || null;

    // 1️⃣ Update promotion itself
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      id,
      {
        name,
        description: description || "",
        discountType,
        discountValue,
        category,
        subCategory,
        brand,
        startDate,
        endDate,
      },
      { new: true }
    );

    if (!updatedPromotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    // 2️⃣ REMOVE promotion from all products first (important!)
    await Product.updateMany(
      { promotion: id },
      { $unset: { promotion: "" } }
    );

    // 3️⃣ Build new filter
    let filter = {};

    if (productId) {
      filter._id = productId;
    } else {
      if (category) filter.category = category;
      if (subCategory) filter.subCategory = subCategory;
      if (brand) filter.brand = brand;
    }

    // 4️⃣ Apply promotion again
    const result = await Product.updateMany(filter, {
      $set: { promotion: id },
    });

    res.json({
      message: "Promotion mise à jour avec succès",
      promotion: updatedPromotion,
      affectedProducts: result.modifiedCount,
    });
  } catch (error) {
    console.error("Update promotion error:", error);
    res.status(500).json({ message: error.message });
  }
};




/**
 * @desc    Get products with VALID promotions
 * @route   GET /api/promotions/products
 * @access  Public
 */
export const getProductsWithPromo = async (req, res) => {
  try {
    const now = new Date();

    // 1️⃣ Récupérer les produits avec promotions valides
    const products = await Product.find()
      .populate({
        path: "promotion",
        match: {
          isActive: true,
          startDate: { $lte: now },
          endDate: { $gte: now },
        },
      })
      .populate("category", "name subCategories");

    // 2️⃣ Filtrer les produits qui ont une promotion (populate match peut renvoyer null)
    const validProducts = products.filter(p => p.promotion);

    // 3️⃣ Construire le résultat
    const result = validProducts.map(p => {
      const subCat = p.category?.subCategories.find(
        sc => sc._id.toString() === p.subCategory?.toString()
      );

      return {
        _id: p._id,
        name: p.name,
        images: p.images || [],
        price: p.price,
        
        promotion: {
          _id: p.promotion._id,
          name: p.promotion.name,
          discountType: p.promotion.discountType,
          discountValue: p.promotion.discountValue,
          startDate: p.promotion.startDate,
          endDate: p.promotion.endDate,
          discountedPrice: p.getFinalPrice(),
        },
        category: p.category?.name || null,
        subCategory: subCat?.name || null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error("getProductsWithPromo error:", error);
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
      
      promotion: {
        _id: promo._id,
        name: promo.name,
        description: promo.description,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        startDate: promo.startDate,
        endDate: promo.endDate,
        isActive: promo.isActive,
        discountedPrice,
      },
    });
  } catch (error) {
    console.error("Error fetching product promotion:", error);
    res.status(500).json({ message: error.message });
  }
};