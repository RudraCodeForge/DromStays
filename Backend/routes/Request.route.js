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

RequestRouter.get(
  "/Get_Requests",
  authMiddleware,
  RequestController.Get_Requests,
);

RequestRouter.post(
  "/respond",
  authMiddleware,
  RequestController.Respond_To_Request,
);

module.exports = RequestRouter;
