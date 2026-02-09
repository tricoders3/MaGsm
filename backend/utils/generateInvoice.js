import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

/* ================== HELPERS ================== */

function generateHeader(doc) {
  const logoPath = path.join("public", "logo.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 60 });
  }

  doc
    .fillColor("#444")
    .fontSize(20)
    .text("MaGsm Boutique", 120, 50)
    .fontSize(10)
    .text("Kairouan - Tunisie", 120, 75)
    .text("Email : contact@magsm.tn", 120, 90);

  generateHr(doc, 120);
}

function generateFooter(doc) {
  doc
    .fontSize(9)
    .fillColor("#666")
    .text(
      "Merci pour votre confiance ❤️ | MaGsm Boutique",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("fr-FR");
}

/* ================== MAIN ================== */

export const generateInvoicePDF = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const invoiceDir = path.join("invoices");
      if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

      const filePath = path.join(invoiceDir, `facture-${order._id}.pdf`);

      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, left: 50, right: 50, bottom: 50 },
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      /* ===== HEADER ===== */
      generateHeader(doc);

      /* ===== FACTURE INFO ===== */
      doc
        .fontSize(18)
        .fillColor("#000")
        .text("FACTURE", 50, 140);

      generateHr(doc, 165);

      doc
        .fontSize(10)
        .text(`Commande N° : ${order._id}`, 50, 180)
        .text(`Date : ${formatDate(order.createdAt)}`, 50, 195);

      /* ===== CLIENT ===== */
      doc
        .font("Helvetica-Bold")
        .text("Client :", 300, 180)
        .font("Helvetica")
        .text(user.name, 300, 195)
        .text(user.email, 300, 210)
        .text(user.phone || "N/A", 300, 225);

      generateHr(doc, 260);

      /* ===== ADRESSE ===== */
      doc
        .font("Helvetica-Bold")
        .text("Adresse de livraison :", 50, 280)
        .font("Helvetica")
        .text(order.shippingAddress.street, 50, 295)
        .text(
          `${order.shippingAddress.postalCode} - ${order.shippingAddress.city}`,
          50,
          310
        )
        .text(order.shippingAddress.country || "Tunisie", 50, 325);

      generateHr(doc, 360);

      /* ===== TABLE HEADER ===== */
      let tableTop = 380;

      doc.font("Helvetica-Bold");
      generateTableRow(doc, tableTop, "Produit", "Prix", "Qté", "Total");
      generateHr(doc, tableTop + 15);

      /* ===== TABLE BODY ===== */
      doc.font("Helvetica");
      order.items.forEach((item, index) => {
        const y = tableTop + 30 + index * 25;
        generateTableRow(
          doc,
          y,
          item.name,
          `${item.price} DT`,
          item.quantity,
          `${item.price * item.quantity} DT`
        );
      });
      // 📦 Livraison
// 📦 Livraison
let currentY = tableTop + 30 + order.items.length * 25 + 10;

generateTableRow(
  doc,
  currentY,
  "Frais de livraison",
  "",
  "",
  `${order.deliveryFee || 7} DT`
);
currentY += 20;

// 🔹 Remise fidélité si applicable
if (order.discount && order.discount > 0) {
  generateTableRow(
    doc,
    currentY,
    `Remise fidélité (${order.pointsUsed} pts)`,
    "",
    "",
    `-${order.discount} DT`
  );
  currentY += 20;
}


      // ===== TOTAL =====
const totalY = currentY + 10;

doc
  .font("Helvetica-Bold")
  .fontSize(14)
  .text(`Total à payer : ${order.total.toFixed(2)} DT`, 400, totalY, {
    align: "right",
  });


      /* ===== FOOTER ===== */
      generateFooter(doc);

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};

/* ================== TABLE ROW ================== */

function generateTableRow(doc, y, item, price, qty, total) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(price, 280, y, { width: 90, align: "right" })
    .text(qty, 370, y, { width: 50, align: "right" })
    .text(total, 450, y, { width: 90, align: "right" });
}
