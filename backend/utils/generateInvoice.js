import PDFDocument from "pdfkit";

export const generateInvoicePDF = (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      /* ===== HEADER ===== */
      doc
        .fontSize(20)
        .text("MaGsm Boutique", { align: "left" })
        .fontSize(10)
        .text("Kairouan - Tunisie")
        .text("Email : contact@magsm.tn");

      doc.moveDown(2);

      /* ===== FACTURE ===== */
      doc.fontSize(18).text("FACTURE", { align: "center" });
      doc.moveDown();

      doc
        .fontSize(10)
        .text(`Commande N° : ${order._id}`)
        .text(
          `Date : ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`
        );

      doc.moveDown();

      /* ===== CLIENT ===== */
      doc.font("Helvetica-Bold").text("Client :");
      doc.font("Helvetica")
        .text(user.name || "N/A")
        .text(user.email || "N/A")
        .text(user.phone || "N/A");

      doc.moveDown(2);

      /* ===== TABLE HEADER ===== */
      doc.font("Helvetica-Bold");
      doc.text("Produit", 50, doc.y);
      doc.text("Qté", 300, doc.y);
      doc.text("Total", 400, doc.y);

      doc.moveDown();
      doc.font("Helvetica");

      /* ===== ITEMS ===== */
      order.items.forEach((item) => {
        const totalItem = item.price * item.quantity;

        doc.text(item.name, 50, doc.y);
        doc.text(String(item.quantity), 300, doc.y);
        doc.text(`${totalItem.toFixed(2)} DT`, 400, doc.y);

        doc.moveDown(0.5);
      });

      doc.moveDown();

      /* ===== TOTAL ===== */
      const delivery = order.deliveryFee ?? 7;

      doc
        .font("Helvetica-Bold")
        .text(`Livraison : ${delivery.toFixed(2)} DT`)
        .text(`Total à payer : ${order.total.toFixed(2)} DT`);

      doc.moveDown(2);
      doc.fontSize(10).text("Merci pour votre confiance ", {
        align: "center",
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
