import Product from "../models/productModel.js";

export const createProductService = async (data) => {
  const product = new Product(data);
  return await product.save();
};

export const getAllProductsService = async () => {
  return await Product.find().populate("category", "name subCategories");
};

export const getProductByIdService = async (id) => {
  const product = await Product.findById(id).populate("category", "name subCategories");
  if (!product) throw new Error("Product not found");
  return product;
};

export const updateProductService = async (id, data) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) product[key] = data[key];
  });

  return await product.save();
};

export const deleteProductService = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new Error("Product not found");
  await product.deleteOne();
  return { message: "Product removed" };
};

export const getProductsByCategoryService = async (categoryId) => {
  const products = await Product.find({ category: categoryId }).populate("category", "name subCategories");

  return products.map((p) => {
    const subCat = p.category.subCategories.find(
      (sc) => sc._id.toString() === p.subCategory.toString()
    );
    return {
      ...p._doc,
      subCategoryName: subCat ? subCat.name : null,
    };
  });
};

export const getProductsBySubCategoryService = async (subCategoryId) => {
  const products = await Product.find().populate("category", "name subCategories");

  const filtered = products.filter(
    (p) => p.subCategory.toString() === subCategoryId
  );

  return filtered.map((p) => {
    const subCat = p.category.subCategories.find(
      (sc) => sc._id.toString() === p.subCategory.toString()
    );
    return {
      ...p._doc,
      subCategoryName: subCat ? subCat.name : null,
    };
  });
};
