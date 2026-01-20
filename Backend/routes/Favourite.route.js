const express = require("express");
const FavouriteRouter = express.Router();
const FavouriteController = require("../controllers/Favourite.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

FavouriteRouter.post(
  "/rooms/:roomId/favourite",
  authMiddleware,
  FavouriteController.addRoomToFavourites,
);
FavouriteRouter.get(
  "/check/:roomId",
  authMiddleware,
  FavouriteController.checkFavouriteStatus,
);
FavouriteRouter.get(
  "/my-favourites",
  authMiddleware,
  FavouriteController.getMyFavourites,
);

module.exports = FavouriteRouter;
