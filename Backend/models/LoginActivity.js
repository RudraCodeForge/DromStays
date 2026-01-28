const mongoose = require("mongoose");

const loginActivitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        ip: {
            type: String,
            required: true,
        },
        device: {
            type: String,
        },
        browser: {
            type: String,
        },
        location: {
            type: String,
            default: "Unknown",
        },
        status: {
            type: String,
            enum: ["SUCCESS", "FAILED"],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// 🔥 Auto delete login activity after 60 days
loginActivitySchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 24 * 60 * 60 }
);

module.exports = mongoose.model("LoginActivity", loginActivitySchema);
