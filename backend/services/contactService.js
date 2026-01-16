import ContactMessage from "../models/contactMessageModel.js"
import nodemailer from "nodemailer"

export const sendContactMessage = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  // 1️⃣ Save message in database
  const savedMessage = await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    message,
  })

  // 2️⃣ Mail configuration
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  // 3️⃣ Send email to admin
  await transporter.sendMail({
    from: `"MA GSM - Contact" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: subject,
    html: `
      <h3>Nouveau message de contact</h3>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Téléphone :</strong> ${phone || "-"}</p>
      <p><strong>Message :</strong></p>
      <p>${message}</p>
    `,
  })

  return savedMessage
}
