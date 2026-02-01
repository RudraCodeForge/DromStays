const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const generateAgreementHTML = require("./generateAgreementHTML");

module.exports = async (data) => {
    const dirPath = path.join(__dirname, "../storage/agreements");
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(
        dirPath,
        `agreement_${data.bookingId}.pdf`
    );

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const html = generateAgreementHTML(data);

    await page.setContent(html, { waitUntil: "networkidle0" });

    await page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true,
    });

    await browser.close();

    return filePath;
};
