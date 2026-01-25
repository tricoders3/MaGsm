import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      // Création du dossier invoices si inexistant
      const invoiceDir = path.join(process.cwd(), "invoices");
      if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);

      const filePath = path.join(invoiceDir, `facture-${order._id}.pdf`);

      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      /* ================= HEADER ================= */
      doc
        .fontSize(20)
        .text("FACTURE", { align: "center" })
        .moveDown();

      doc
        .fontSize(12)
        .text(`Facture N° : ${order._id}`)
        .text(`Date : ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`)
        .moveDown();

      /* ================= CLIENT ================= */
      doc
        .fontSize(12)
        .text("Client :", { underline: true })
        .text(`Nom : ${user.name}`)
        .text(`Email : ${user.email}`)
        .text(`Téléphone : ${user.phone || "N/A"}`)
        .moveDown();

      /* ================= TABLE PRODUITS ================= */
      doc
        .fontSize(12)
        .text("Produits :", { underline: true })
        .moveDown(0.5);

      // Entêtes de tableau
      doc.font("Helvetica-Bold");
      doc.text("Produit", 50, doc.y, { width: 300 });
      doc.text("Quantité", 360, doc.y, { width: 60, align: "right" });
      doc.text("Prix", 430, doc.y, { width: 100, align: "right" });
      doc.moveDown();
      doc.font("Helvetica");

      order.items.forEach((item) => {
        const prixTotal = item.price * item.quantity;
        doc.text(item.name, 50, doc.y, { width: 300 });
        doc.text(item.quantity.toString(), 360, doc.y, { width: 60, align: "right" });
        doc.text(`${prixTotal.toFixed(3)} D.T`, 430, doc.y, { width: 100, align: "right" });
        doc.moveDown();
      });

      doc.moveDown();

      /* ================= CALCUL ================= */
      const totalHT = order.totalHT || order.total; // si tu stockes HT
      const tva = order.tva || totalHT * 0.18;
      const remise = order.remise || 0;
      const fraisLivraison = order.shipping || 4.400; // exemple

      const totalTTC = totalHT + tva - remise + fraisLivraison;

      doc
        .text(`Sous-total : ${totalHT.toFixed(3)} D.T`, { align: "right" })
        .text(`Remise : -${remise.toFixed(3)} D.T`, { align: "right" })
        .text(`Expédition : ${fraisLivraison.toFixed(3)} D.T`, { align: "right" })
        .text(`TVA (18%) : ${tva.toFixed(3)} D.T`, { align: "right" })
        .font("Helvetica-Bold")
        .text(`Total : ${totalTTC.toFixed(3)} D.T`, { align: "right" })
        .font("Helvetica")
        .moveDown();

      doc
        .text(`Moyen de paiement : ${order.paymentMethod || "Paiement à la livraison"}`)
        .moveDown();

      /* ================= ADRESSES ================= */
      doc
        .fontSize(12)
        .text("Adresse de facturation :", { underline: true })
        .text(order.billingAddress || "N/A")
        .moveDown()
        .text("Adresse de livraison :", { underline: true })
        .text(order.shippingAddress || "N/A");

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", (err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};
