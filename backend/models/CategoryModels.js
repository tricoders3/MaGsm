// models/Category.js
import mongoose from "mongoose";

const subCategorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { _id: true }
);

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String, 
      required: true,
    },

    subCategories: [subCategorySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
