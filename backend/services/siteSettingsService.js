import siteSettingsModel from "../models/siteSettingsModel.js";

// 🔹 Récupérer tout le contenu du site
export const getSiteContent = async () => {
  let content = await siteSettingsModel.findOne();
  if (!content) {
    content = await siteSettingsModel.create({
      about: {
        title: "About Us",
        whoWeAre: "",
        content: "",
        features: [
          { title: "Curated Products", description: "" },
          { title: "Customer First", description: "" },
          { title: "Fast Service", description: "" },
        ],
        mapUrl: "",
      },
    });
  }
  return content;
};

// 🔹 Mettre à jour n'importe quelle section
export const updateSection = async (section, data) => {
  const content = await getSiteContent();

  if (!content[section]) {
    throw new Error(`Section "${section}" inconnue`);
  }

  // Merge pour About et Features si nécessaire
  if (section === "about" && data.features) {
    // Merge chaque feature individuellement
    const mergedFeatures = content.about.features.map((f, index) => ({
      ...f,
      ...(data.features[index] || {}),
    }));
    content.about.features = mergedFeatures;
    // Supprimer features du data pour éviter override
    delete data.features;
  }

  // Merge général
  content[section] = { ...content[section], ...data };

  await content.save();
  return content;
};
