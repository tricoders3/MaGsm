import Product from "../models/productModel.js"


/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private (admin)
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      images,
      brand,
      category,
      subCategory,
      description,
      price,
      countInStock,
    } = req.body;

    const product = new Product({

      name,
      images,
      brand,
      category,
      subCategory,
      description,
      price,
      countInStock,
    });

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
    const products = await Product.find()
     .populate("category", "name subCategories"); 

    res.json(products);
  } catch (error) {
    console.error(error);     
    res.status(500).json({ message: "Error fetching products", error: error.message });
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

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = req.body.name || product.name;
    product.images = req.body.images || product.images;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.subCategory = req.body.subCategory || product.subCategory;
    product.description = req.body.description || product.description;
    product.price = req.body.price ?? product.price;
    product.countInStock = req.body.countInStock ?? product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
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
    }).populate("category", "name subCategories");

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
    const products = await Product.find().populate("category", "name subCategories");

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
      };
    });

    res.json(filtered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products by subCategory" });
  }
};
