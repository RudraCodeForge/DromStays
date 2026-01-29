const Invoice = require("../models/Invoice");
const generateInvoicePDF = require("./generateInvoicePDF");

const mapPaymentMethod = (method) => {
    if (!method) return "Manual";

    switch (method) {
        case "MANUAL":
            return "Manual";
        case "CASH":
            return "Cash";
        case "UPI":
            return "UPI";
        default:
            return "Manual";
    }
};

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
    // 🧾 Create Invoice
    const invoice = await Invoice.create({
        invoiceNumber: `INV-${Date.now()}`,

        // 👤 Tenant
        user: tenant,

        // 👑 Owner (IMPORTANT)
        owner: owner,

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

        paymentMethod: mapPaymentMethod(payment.paymentMethod),

        notes: `${type} invoice for ${property.name}`,
    });

    // 📄 Generate PDF
    const pdfUrl = await generateInvoicePDF(invoice);
    invoice.pdfUrl = pdfUrl;
    await invoice.save();

    // 🔗 Link Payment → Invoice
    payment.invoice = invoice._id;
    await payment.save();

    return invoice;
};

module.exports = createInvoiceWithPDF;
