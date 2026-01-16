import { sendContactMessage } from "../services/contactService.js"

export const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Champs obligatoires manquants" })
    }

    await sendContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    })

    res.status(201).json({
      message: "Message envoyé avec succès",
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
