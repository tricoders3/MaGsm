import { getSiteContent, updateSection } from "../services/siteSettingsService.js";

// PUBLIC
export const getContent = async (req, res) => {
  try {
    const content = await getSiteContent();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET spécifique pour chaque section
export const getHome = async (req, res) => {
  const content = await getSiteContent();
  res.status(200).json(content.home);
};

export const getBanner = async (req, res) => {
  const content = await getSiteContent();
  res.status(200).json(content.banner);
};

export const getAbout = async (req, res) => {
  const content = await getSiteContent();
  res.status(200).json(content.about);
};

export const getContact = async (req, res) => {
  const content = await getSiteContent();
  res.status(200).json(content.contact);
};

export const getOffers = async (req, res) => {
  const content = await getSiteContent();
  res.status(200).json(content.offers);
};

// ADMIN – update
export const updateHome = async (req, res) => {
  const content = await updateSection("home", req.body);
  res.json(content.home);
};

export const updateBanner = async (req, res) => {
  const content = await updateSection("banner", req.body);
  res.json(content.banner);
};

export const updateAbout = async (req, res) => {
  const content = await updateSection("about", req.body);
  res.json(content.about);
};

export const updateContact = async (req, res) => {
  const content = await updateSection("contact", req.body);
  res.json(content.contact);
};

export const updateOffers = async (req, res) => {
  const content = await updateSection("offers", req.body);
  res.json(content.offers);
};
