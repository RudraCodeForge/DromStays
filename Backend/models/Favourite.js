const mongoose = require("mongoose");
const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  { timestamps: true },
);

favouriteSchema.index({ userId: 1, roomId: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", favouriteSchema);
