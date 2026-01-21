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
    enum: ["in", "out"], // in = En stock, out = Préteur / rupture
    default: "in",
  },
promotion: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion", default: null }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
