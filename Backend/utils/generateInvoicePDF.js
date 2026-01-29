const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoicePDF = (invoice) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: "A4", margin: 50 });

        const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
        const filePath = path.join(
            __dirname,
            "../uploads/invoices",
            fileName
        );

        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // 🧾 Header
        doc
            .fontSize(20)
            .text("INVOICE", { align: "center" })
            .moveDown();

        doc.fontSize(12);
        doc.text(`Invoice No: ${invoice.invoiceNumber}`);
        doc.text(`Date: ${invoice.invoiceDate.toDateString()}`);
        doc.text(`Status: ${invoice.paymentStatus}`);
        doc.moveDown();

        // 👤 Customer
        doc.text(`Billed To: ${invoice.user}`);
        doc.moveDown();

        // 📦 Items
        invoice.items.forEach((item, index) => {
            doc.text(
                `${index + 1}. ${item.title} | Qty: ${item.quantity} | ₹${item.price}`
            );
        });

        doc.moveDown();
        doc.text(`Subtotal: ₹${invoice.subtotal}`);
        doc.text(`Tax: ₹${invoice.tax}`);
        doc.fontSize(14).text(`Total: ₹${invoice.totalAmount}`);

        doc.end();

        stream.on("finish", () => {
            resolve(`/uploads/invoices/${fileName}`);
        });

        stream.on("error", reject);
    });
};

module.exports = generateInvoicePDF;
