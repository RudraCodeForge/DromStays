const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        // Kis user ko notification hai
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Notification ka title
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // Main message
        message: {
            type: String,
            required: true,
        },

        // Notification type (filtering ke liye useful)
        type: {
            type: String,
            enum: [
                "REQUEST",
                "PAYMENT",
                "INFO",
                "MESSAGE",
                "SYSTEM",
                "REMINDER",
            ],
            default: "SYSTEM",
        },

        // Extra data (requestId, invoiceId, etc.)
        data: {
            type: Object,
            default: {},
        },

        // Click karne par kahan redirect ho
        redirectUrl: {
            type: String,
            default: "",
        },

        // Read / Unread status
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // createdAt & updatedAt
    }
);

module.exports = mongoose.model("Notification", notificationSchema);
