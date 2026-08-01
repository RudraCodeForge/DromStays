const express = require("express");
const ServiceRouter = express.Router();
const ServiceController = require("../controllers/Service.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

ServiceRouter.post(
  "/SearchServices",
  authMiddleware,
  ServiceController.searchServices,
);
module.exports = ServiceRouter;
