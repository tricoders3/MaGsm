import { getSiteContent, updateSection } from "../services/siteSettingsService.js";

// PUBLIC – frontend
export const getContent = async (req, res) => {
  try {
    const content = await getSiteContent()
    res.status(200).json(content)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ADMIN
export const updateHome = async (req, res) => {
  const content = await updateSection("home", req.body)
  res.json(content.home)
}

export const updateBanner = async (req, res) => {
  const content = await updateSection("banner", req.body)
  res.json(content.banner)
}

export const updateAbout = async (req, res) => {
  const content = await updateSection("about", req.body)
  res.json(content.about)
}

export const updateContact = async (req, res) => {
  const content = await updateSection("contact", req.body)
  res.json(content.contact)
}

export const updateOffers = async (req, res) => {
  const content = await updateSection("offers", req.body)
  res.json(content.offers)
}
