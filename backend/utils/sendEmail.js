// utils/sendEmail.js
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendAdminOrderNotification = async ({ user, order }) => {
  await transporter.sendMail({
    from: `"Shop" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🛒 Nouvelle commande",
    html: `
      <h3>Nouvelle commande reçue</h3>
      <p><strong>Client :</strong> ${user.name}</p>
      <p><strong>Email :</strong> ${user.email}</p>
      <p><strong>Total :</strong> ${order.total} DT</p>
      <p><strong>ID commande :</strong> ${order._id}</p>
    `,
  })
}
