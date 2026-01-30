import Brand from "../models/BrandModel.js";


export const createBrand = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nom de marque requis" });
    }

    const exists = await Brand.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Marque déjà existante" });
    }

    const brand = await Brand.create({
      name,
      description,
      isActive,
      logo: req.file?.path || null, // 🔥 URL Cloudinary
    });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* ================= READ ALL ================= */
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= READ ONE ================= */
export const getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ message: "Marque introuvable" });
    }
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */

export const updateBrand = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    if (req.file) {
      data.logo = req.file.path; // 🔥 nouvelle image
    }

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({ message: "Marque introuvable" });
    }

    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE ================= */
export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({ message: "Marque introuvable" });
    }

    res.status(200).json({ message: "Marque supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
