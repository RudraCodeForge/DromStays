const express = require("express");
const PartnerRouter = express.Router();

const PartnerController = require("../controllers/Partner.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  partnerProfileUpload,
  serviceUpload,
} = require("../middlewares/partnerUpload");

PartnerRouter.post(
  "/profile",
  authMiddleware,
  partnerProfileUpload,
  PartnerController.submitPartnerProfile,
);

PartnerRouter.get("/profile", authMiddleware, PartnerController.CheckProfile);

PartnerRouter.post(
  "/AddServices",
  authMiddleware,
  serviceUpload,
  PartnerController.AddServices,
);

module.exports = PartnerRouter;
