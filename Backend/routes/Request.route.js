const express = require("express");
const RequestRouter = express.Router();
const RequestController = require("../controllers/Request.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new room booking/request
RequestRouter.post(
  "/make_request",
  authMiddleware,
  RequestController.makeRequest,
);

module.exports = RequestRouter;
