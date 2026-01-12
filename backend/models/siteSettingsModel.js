import mongoose from "mongoose"

const siteContentSchema = new mongoose.Schema(
  {
    home: {
      title: String,
      subtitle: String,
    },

    banner: {
      title: String,
      description: String,
      image: String,
    },

    about: {
      title: String,
      description: String,
    },

    contact: {
      title: String,
      description: String,
      phone: String,
      email: String,
      address: String,
      hours: String,
    },

    offers: {
      flashSaleTitle: String,
      flashSaleSubtitle: String,
      discountPercentage: Number,
      remainingTime: String,
      sectionTitle: String,
      sectionDescription: String,
    },
  },
  { timestamps: true }
)

export default mongoose.model("SiteContent", siteContentSchema)
