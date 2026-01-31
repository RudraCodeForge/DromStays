const Invoice = require("../models/Invoice");
const generateInvoicePDF = require("./generateInvoicePDF");

const createInvoiceWithPDF = async ({
    tenant,
    owner,
    property,
    room,
    payment,
    type,
    amount,
    status,
}) => {
    /* 🧾 CREATE INVOICE (PAYMENT ID INCLUDED) */
    const invoice = await Invoice.create({
        invoiceNumber: `INV-${Date.now()}`,

        user: tenant,
        owner: owner,

        // 🔥 FIX: PAYMENT ID STORED IN INVOICE
        payments: [payment._id],

        items: [
            {
                title: `${type} Payment - Room ${room.roomNumber}`,
                quantity: 1,
                price: amount,
            },
        ],

        subtotal: amount,
        tax: 0,
        totalAmount: amount,

        paymentStatus: status === "PAID" ? "Paid" : "Pending",

        notes: `${type} invoice for ${property.name}`,
    });

    /* 📄 GENERATE PDF */
    const pdfUrl = await generateInvoicePDF(invoice);
    invoice.pdfUrl = pdfUrl;
    await invoice.save();

    /* 🔗 LINK PAYMENT → INVOICE */
    payment.invoice = invoice._id;
    await payment.save();

    return invoice;
};

module.exports = createInvoiceWithPDF;
