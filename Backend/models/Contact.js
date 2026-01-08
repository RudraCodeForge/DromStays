const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 Auto delete after 24 hours
contactSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 86400 } // 24 hours
);

module.exports = mongoose.model("Contact", contactSchema);
