import PDFDocument from "pdfkit";

/* ================== MAIN ================== */

export const generateInvoicePDF = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margins: { top: 50, left: 50, right: 50, bottom: 50 },
      });

      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      /* ===== HEADER ===== */
      doc
        .fontSize(20)
        .text("MaGsm Boutique", 50, 50)
        .fontSize(10)
        .text("Kairouan - Tunisie")
        .text("Email : contact@magsm.tn");

      doc.moveDown();

      /* ===== FACTURE ===== */
      doc.fontSize(18).text("FACTURE");
      doc.moveDown();

      doc
        .fontSize(10)
        .text(`Commande N° : ${order._id}`)
        .text(`Date : ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`);

      doc.moveDown();

      /* ===== CLIENT ===== */
      doc.font("Helvetica-Bold").text("Client :");
      doc.font("Helvetica")
        .text(user.name)
        .text(user.email)
        .text(user.phone || "N/A");

      doc.moveDown();

      /* ===== ITEMS ===== */
      doc.font("Helvetica-Bold");
      doc.text("Produit", 50, doc.y, { continued: true });
      doc.text("Qté", 300, doc.y, { continued: true });
      doc.text("Total", 400, doc.y);

      doc.moveDown();
      doc.font("Helvetica");

      order.items.forEach((item) => {
        doc.text(item.name, 50, doc.y, { continued: true });
        doc.text(item.quantity.toString(), 300, doc.y, { continued: true });
        doc.text(`${item.price * item.quantity} DT`, 400, doc.y);
      });

      doc.moveDown();

      doc.font("Helvetica-Bold")
        .text(`Livraison : ${order.deliveryFee || 7} DT`)
        .text(`Total à payer : ${order.total.toFixed(2)} DT`);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
