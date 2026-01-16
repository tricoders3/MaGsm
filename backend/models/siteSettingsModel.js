import mongoose from "mongoose";

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
      title: String,           // About Title
      whoWeAre: String,        // "who we are"
      content: String,         // About Content
      features: [
        {
          title: String,       // Feature title, ex: "Curated Products"
          description: String  // Feature Description
        }
      ],
      mapUrl: String           // Google Map Embed URL
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
);

export default mongoose.model("SiteContent", siteContentSchema);
