// utils/sendEmail.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})


export const sendClientOrderConfirmation = async ({ user, order }) => {
  if (!user.email) throw new Error("Email du client introuvable");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"MaGsm Boutique" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Confirmation de votre commande ${order._id}`,
    html: `
      <h2>Bonjour ${user.name || "Cher client"},</h2>
      <p>Merci pour votre commande !</p>
      <ul>
        <li><strong>ID commande:</strong> ${order._id}</li>
        <li><strong>Total:</strong> ${order.total} DT</li>
        <li><strong>Points fidélité gagnés:</strong> ${order.pointsEarned}</li>
      </ul>
      <p>Nous vous remercions pour votre confiance !</p>
    `,
  });
};



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
// Fonction générique pour envoyer un mail
export const sendEmail = async ({ to, subject, text, html }) => {
  await transporter.sendMail({
    from: `"Shop" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text, // optionnel si html fourni
    html, // optionnel si text fourni
  });
};

