import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("Missing EMAIL_USER or EMAIL_PASS in .env");
}
if (!process.env.ADMIN_EMAIL) {
  console.warn("ADMIN_EMAIL not defined in .env");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendClientOrderConfirmation = async ({ user, order, invoicePath }) => {
  if (!user?.email) throw new Error("User email is missing");

  await transporter.sendMail({
    from: `"MaGsm Boutique" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Confirmation de commande & facture",
    html: `
      <h3>Bonjour ${user.name},</h3>
      <p>Votre commande a bien été enregistrée.</p>
      <p>Vous trouverez votre facture en pièce jointe.</p>
      <p><strong>Total:</strong> ${order.total} DT</p>
      <p><strong>Points fidélité gagnés:</strong> ${order.pointsEarned || 0}</p>
      <p>🚚 Livraison estimée entre <strong>24 et 72 heures</strong></p>
      <br/>
      <p>Merci pour votre confiance 🙏</p>
    `,
    attachments: invoicePath ? [{ filename: `facture-${order._id}.pdf`, path: invoicePath }] : [],
  });
};

export const sendAdminOrderNotification = async ({ user, order }) => {
  if (!process.env.ADMIN_EMAIL) return;

  await transporter.sendMail({
    from: `"MaGsm" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🛒 Nouvelle commande",
    html: `
      <h3>Nouvelle commande reçue</h3>
      <p><strong>Client :</strong> ${user.name}</p>
      <p><strong>Email :</strong> ${user.email}</p>
      <p><strong>Total :</strong> ${order.total} DT</p>
      <p><strong>ID commande :</strong> ${order._id}</p>
    `,
  });
};

export const sendEmail = async ({ to, subject, text, html }) => {
  if (!to) throw new Error("Recipient 'to' is missing");

  await transporter.sendMail({
    from: `"MaGsm" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

export const sendAdminRequestEmail = async (user) => {
  if (!process.env.ADMIN_EMAIL) return;

  await transporter.sendMail({
    from: `"MA GSM - Inscription" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "Nouvelle inscription sur le site",
    html: `
      <p>Bonjour Admin,</p>
      <p>L'utilisateur <b>${user.name}</b> (${user.email}) vient de s'inscrire sur le site.</p>
      <p>Vous pouvez consulter les demandes en attente dans le dashboard admin pour approuver ce compte.</p>
    `,
  });
};

export const sendApprovalEmail = async (email, name) => {
  if (!email) throw new Error("Recipient email is missing");

  const clientLoginUrl = `${process.env.CLIENT_URL}/login`;

  await transporter.sendMail({
    from: `"MA GSM" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Votre compte a été approuvé et vous avez reçu 100 points fidélité !",
    html: `
      <p>Bonjour <b>${name}</b>,</p>
      <p>Félicitations ! Votre compte a été validé par l'administrateur de MaGsm.</p>
      <p>Vous bénéficiez de <b>100 points fidélité</b> sur votre compte.</p>
      <p>Vous pouvez maintenant vous connecter et accéder aux prix en cliquant ici : 
         <a href="${clientLoginUrl}">Se connecter</a>
      </p>
      <p>Merci de votre confiance et bon shopping !</p>
    `,
  });
};
