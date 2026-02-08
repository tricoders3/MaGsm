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



export const sendClientOrderConfirmation = async ({
  user,
  order,
  invoiceBuffer, // 👈 بدل invoicePath
}) => {
  const mailOptions = {
    from: `"MaGsm Boutique" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Confirmation de commande & facture",
    html: `
      <h3>Bonjour ${user.name},</h3>
      <p>Votre commande a bien été enregistrée ✅</p>
      <p>Vous trouverez votre facture en pièce jointe.</p>
      <p><strong>Total :</strong> ${order.total} DT</p>
      <p><strong>Points fidélité gagnés :</strong> ${order.pointsEarned}</p>
      <p>🚚 Livraison estimée entre <b>24 et 72 heures</b></p>
      <br />
      <p>Merci pour votre confiance 🙏</p>
    `,
  };

  // ✅ Ajouter la facture seulement si elle existe
  if (invoiceBuffer) {
    mailOptions.attachments = [
      {
        filename: `facture-${order._id}.pdf`,
        content: invoiceBuffer,              // 👈 BUFFER
        contentType: "application/pdf",
      },
    ];
  }

  await transporter.sendMail(mailOptions);
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

export const sendAdminRequestEmail = async (user) => {
  const mailOptions = {
    from: `"MA GSM - Inscription" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "Nouvelle inscription sur le site",
    html: `
      <p>Bonjour Admin,</p>
      <p>L'utilisateur <b>${user.name}</b> (${user.email}) vient de s'inscrire sur le site.</p>
      <p>Vous pouvez consulter les demandes en attente dans le dashboard admin pour approuver ce compte.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};


export const sendApprovalEmail = async (email, name) => {
  const clientLoginUrl = `${process.env.CLIENT_URL}/login`; // lien vers le frontend login

  const mailOptions = {
    from: `"MA GSM" <${process.env.SMTP_USER}>`,
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
  };

  await transporter.sendMail(mailOptions);
};
