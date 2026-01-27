const Favourite = require("../models/Favourite");

// 🔁 ADD / REMOVE (TOGGLE)
exports.addRoomToFavourites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;


    if (!roomId) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const existing = await Favourite.findOne({ userId, roomId });

    if (existing) {
      await Favourite.deleteOne({ _id: existing._id });
      return res.status(200).json({
        success: true,
        message: "Room removed from favourites",
      });
    }

    // add new favourite
    await Favourite.create({ userId, roomId });

    res.status(201).json({
      success: true,
      message: "Room added to favourites",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ✅ CHECK STATUS
exports.checkFavouriteStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    const fav = await Favourite.findOne({ userId, roomId });

    res.status(200).json({
      success: true,
      isFavourite: !!fav,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// 📦 GET MY FAVOURITES
exports.getMyFavourites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favourites = await Favourite.find({ userId }).populate("roomId");

    const rooms = favourites
      .map((fav) => fav.roomId)
      .filter((room) => room !== null);
    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
