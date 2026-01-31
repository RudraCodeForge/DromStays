const fs = require("fs");
const path = require("path");

const deleteOldInvoicePdf = (pdfUrl) => {
    if (!pdfUrl) return;

    const filePath = path.join(__dirname, "..", pdfUrl);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // 🔥 delete file
    }
};

module.exports = deleteOldInvoicePdf;
