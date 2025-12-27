const express = require("express");
const PropertyRouter = express.Router();
const PropertyController = require("../controllers/PropertyController");
const authMiddleware = require("../middlewares/authMiddleware");

PropertyRouter.post("/add", authMiddleware, PropertyController.addProperty);
PropertyRouter.get(
  "/owner_properties",
  authMiddleware,
  PropertyController.getOwnerProperties
);

module.exports = PropertyRouter;
