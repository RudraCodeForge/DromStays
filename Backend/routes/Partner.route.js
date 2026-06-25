const express = require("express");
const PartnerRouter = express.Router();
const PartnerController = require("../controllers/Partner.Controller");
const authMiddleware = require("../middlewares/authMiddleware");
const partnerUpload = require("../middlewares/partnerUpload");

PartnerRouter.post(
  "/profile",
  authMiddleware,
  partnerUpload,
  PartnerController.submitPartnerProfile,
);
PartnerRouter.get("/profile", authMiddleware, PartnerController.CheckProfile);

module.exports = PartnerRouter;
