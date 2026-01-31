const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },

        // 👤 Tenant / Customer
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tenant",
            required: true,
        },

        // 👑 Owner
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // 🔗 RELATED PAYMENTS (VERY IMPORTANT)
        payments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Payment",
            },
        ],

        items: [
            {
                title: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],

        subtotal: {
            type: Number,
            required: true,
        },

        tax: {
            type: Number,
            default: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        // 🔥 BETTER STATUS
        paymentStatus: {
            type: String,
            enum: ["Pending", "Partial", "Paid"],
            default: "Pending",
        },

        invoiceDate: {
            type: Date,
            default: Date.now,
        },

        dueDate: Date,

        pdfUrl: String,
        notes: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
