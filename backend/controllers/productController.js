import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  getProductsByCategoryService,
  getProductsBySubCategoryService
} from "../services/productService.js";

export const createProduct = async (req, res) => {
  try {
    const createdProduct = await createProductService(req.body);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await updateProductService(req.params.id, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const result = await deleteProductService(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await getProductsByCategoryService(req.params.categoryId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsBySubCategory = async (req, res) => {
  try {
    const products = await getProductsBySubCategoryService(req.params.subCategoryId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
