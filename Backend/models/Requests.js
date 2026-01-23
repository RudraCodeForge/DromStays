import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: ["special", "maintenance", "complaint", "room_visit"],
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    propertyName: {
      type: String,
      required: true,
    },

    roomNo: {
      type: String,
      required: true,
    },

    // 🔹 Common message
    message: {
      type: String,
      required: true,
      maxlength: 300,
    },

    // 🔹 ONLY for room visit request
    visitDate: {
      type: Date,
    },

    visitTimeSlot: {
      type: String, // "10:00 AM - 11:00 AM"
    },

    purposeOfVisit: {
      type: String, // parents / guest / inspection
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    ownerResponse: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Request", requestSchema);
