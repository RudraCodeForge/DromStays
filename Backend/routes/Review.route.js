const express = require("express");
const ReviewRouter = express.Router();
const ReviewrController = require("../controllers/Review.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

ReviewRouter.get("/Get_Reviews", ReviewrController.GET_REVIEWS);

ReviewRouter.post(
  "/Submit_Reviews",
  authMiddleware, // ✅ logged-in user
  ReviewrController.SUBMIT_REVIEW
);

module.exports = ReviewRouter;
