const express = require("express");
const PartnerRouter = express.Router();

const PartnerController = require("../controllers/Partner.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

const {
  partnerProfileUpload,
  serviceUpload,
} = require("../middlewares/partnerUpload");

// =======================
// Partner Profile
// =======================

PartnerRouter.post(
  "/profile",
  authMiddleware,
  partnerProfileUpload,
  PartnerController.submitPartnerProfile,
);

PartnerRouter.get("/profile", authMiddleware, PartnerController.CheckProfile);

// =======================
// Services
// =======================

PartnerRouter.post(
  "/Services",
  authMiddleware,
  serviceUpload,
  PartnerController.AddServices,
);
PartnerRouter.get("/Services", authMiddleware, PartnerController.GetServices);

module.exports = PartnerRouter;
