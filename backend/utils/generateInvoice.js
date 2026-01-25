import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const invoiceDir = path.join("invoices");
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir);
      }

      const filePath = path.join(invoiceDir, `facture-${order._id}.pdf`);
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // 🧾 HEADER
      doc
        .fontSize(20)
        .text("FACTURE", { align: "center" })
        .moveDown();

      doc
        .fontSize(12)
        .text(`[Commande N°${order._id}] (${new Date(order.createdAt).toLocaleDateString("fr-FR")})`)
        .moveDown();

      // 👤 CLIENT
      doc.text(`Client: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.text(`Téléphone: ${user.phone || "N/A"}`);
      doc.moveDown();

      // 📍 ADRESSE DE LIVRAISON
      doc.text("Adresse de livraison:", { underline: true });
      doc.text(order.shippingAddress || "N/A");
      doc.moveDown();

      // 📦 PRODUITS EN TABLEAU
      doc.text("Détails de la commande:", { underline: true });
      doc.moveDown(0.5);

      // Table header
      doc.font("Helvetica-Bold");
      doc.text("Produit", 50, doc.y, { continued: true });
      doc.text("Quantité", 300, doc.y, { continued: true });
      doc.text("Prix", 400, doc.y);
      doc.moveDown(0.5);

      doc.font("Helvetica");
      order.items.forEach((item) => {
        doc.text(item.name, 50, doc.y, { continued: true });
        doc.text(item.quantity.toString(), 300, doc.y, { continued: true });
        doc.text(`${item.price} DT`, 400, doc.y);
      });

     // 💳 FIDÉLITÉ
if (order.discount > 0) {
  doc.moveDown();
  doc.fontSize(12)
     .text(`Remise fidélité : -${order.discount.toFixed(2)} DT`)
     .text(`Points utilisés : ${order.pointsUsed}`);
}

// 💰 TOTAL FINAL
doc.moveDown();
doc.fontSize(14)
   .text(`Total à payer : ${order.total.toFixed(2)} DT`, { align: "right" });




      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
