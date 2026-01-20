const Favourite = require("../models/Favourite");

// 🔁 ADD / REMOVE (TOGGLE)
exports.addRoomToFavourites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { roomId } = req.params;

    // check if already favourited
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
    console.error("Error in addRoomToFavourites:", error);
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
    console.error("Error in checkFavouriteStatus:", error);
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
      .filter((room) => room !== null); // filter out deleted rooms
    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Error in getMyFavourites:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
