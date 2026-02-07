import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  images: [{ url: String }],
  brand: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
  description: String,
  price: { type: Number, required: true },
   countInStock: {
    type: String,
    enum: ["in", "out"], 
    default: "in",
  },
promotion: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion", default: null }
}, { timestamps: true });
productSchema.methods.getFinalPrice = function () {
  if (!this.promotion || !this.promotion.isValid) {
    return this.price;
  }

  let discountedPrice = this.price;

  if (this.promotion.discountType === "percentage") {
    discountedPrice -= (this.price * this.promotion.discountValue) / 100;
  } else {
    discountedPrice -= this.promotion.discountValue;
  }

  return Math.max(discountedPrice, 0);
};

export default mongoose.model("Product", productSchema);
