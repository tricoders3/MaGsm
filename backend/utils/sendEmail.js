import nodemailer from "nodemailer";

/**
 * Transporter SMTP (Gmail)
 * ⚠️ Assure-toi d'utiliser un MOT DE PASSE D’APPLICATION Gmail
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000,
  socketTimeout: 5000,
});

/**
 * Envoi email ASYNCHRONE (ne bloque JAMAIS l’API)
 */
const sendMailAsync = (mailOptions) => {
  setImmediate(async () => {
    try {
      await transporter.sendMail(mailOptions);
      console.log("📧 Email envoyé :", mailOptions.to);
    } catch (error) {
      console.error("❌ Erreur SMTP :", error.message);
    }
  });
};

/* ======================================================
   EMAIL CLIENT – CONFIRMATION COMMANDE + FACTURE
====================================================== */
export const sendClientOrderConfirmation = ({ user, order, invoicePath }) => {
  sendMailAsync({
    from: `"MaGsm Boutique" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Confirmation de commande & facture",
    html: `
      <h3>Bonjour ${user.name},</h3>
      <p>Votre commande a bien été enregistrée.</p>
      <p>Vous trouverez votre facture en pièce jointe.</p>

      <p><strong>Total :</strong> ${order.total} DT</p>
      <p><strong>Points fidélité gagnés :</strong> ${order.pointsEarned}</p>

      <p>🚚 Livraison estimée entre <strong>24 et 72 heures</strong></p>
      <br />
      <p>Merci pour votre confiance 🙏</p>
    `,
    attachments: [
      {
        filename: `facture-${order._id}.pdf`,
        path: invoicePath,
      },
    ],
  });
};

/* ======================================================
   EMAIL ADMIN – NOUVELLE COMMANDE
====================================================== */
export const sendAdminOrderNotification = ({ user, order }) => {
  sendMailAsync({
    from: `"MaGsm" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🛒 Nouvelle commande reçue",
    html: `
      <h3>Nouvelle commande</h3>
      <p><strong>Client :</strong> ${user.name}</p>
      <p><strong>Email :</strong> ${user.email}</p>
      <p><strong>Total :</strong> ${order.total} DT</p>
      <p><strong>ID commande :</strong> ${order._id}</p>
    `,
  });
};

/* ======================================================
   EMAIL GÉNÉRIQUE
====================================================== */
export const sendEmail = ({ to, subject, text, html }) => {
  sendMailAsync({
    from: `"MaGsm" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
};

/* ======================================================
   EMAIL ADMIN – NOUVELLE INSCRIPTION
====================================================== */
export const sendAdminRequestEmail = (user) => {
  sendMailAsync({
    from: `"MA GSM - Inscription" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "Nouvelle inscription sur le site",
    html: `
      <p>Bonjour Admin,</p>
      <p>
        L'utilisateur <b>${user.name}</b> (${user.email})
        vient de s'inscrire sur le site.
      </p>
      <p>
        Consultez le dashboard admin pour approuver ce compte.
      </p>
    `,
  });
};

/* ======================================================
   EMAIL CLIENT – COMPTE APPROUVÉ
====================================================== */
export const sendApprovalEmail = (email, name) => {
  const clientLoginUrl = `${process.env.CLIENT_URL}/login`;

  sendMailAsync({
    from: `"MA GSM" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "🎉 Compte approuvé + 100 points fidélité",
    html: `
      <p>Bonjour <b>${name}</b>,</p>
      <p>Votre compte a été approuvé par l’administrateur.</p>
      <p>🎁 Vous avez reçu <b>100 points fidélité</b>.</p>
      <p>
        👉 <a href="${clientLoginUrl}">Se connecter</a>
      </p>
      <p>Bon shopping 🛍️</p>
    `,
  });
};
