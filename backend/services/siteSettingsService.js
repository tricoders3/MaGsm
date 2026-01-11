import siteSettingsModel from "../models/siteSettingsModel.js";

// get all site content
export const getSiteContent = async () => {
  let content = await siteSettingsModel.findOne()
  if (!content) {
    content = await siteSettingsModel.create({})
  }
  return content
}

// update any section (home, banner, about, contact, offers)
export const updateSection = async (section, data) => {
  const content = await getSiteContent()
  content[section] = { ...content[section], ...data }
  await content.save()
  return content
}
