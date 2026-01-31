const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const invoiceTemplate = require("./invoiceTemplate");

// 🔥 ENSURE DIRECTORY EXISTS
const invoicesDir = path.join(__dirname, "../uploads/invoices");
if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
}

const generateInvoicePdf = async (invoice) => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const html = invoiceTemplate(invoice);
    await page.setContent(html, { waitUntil: "networkidle0" });

    const filePath = path.join(
        invoicesDir,
        `invoice-${invoice.invoiceNumber}.pdf`
    );

    await page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true,
    });

    await browser.close();

    return `/uploads/invoices/invoice-${invoice.invoiceNumber}.pdf`;
};

module.exports = generateInvoicePdf;
