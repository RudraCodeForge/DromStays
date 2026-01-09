const express = require("express");
const SupportRouter = express.Router();
const SupportController = require("../controllers/Support.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

// Route to handle contact support form submission
SupportRouter.post("/contact", SupportController.contactSupport);
// Route to handle ticket creation
SupportRouter.post("/tickets", authMiddleware, SupportController.createTicket);
module.exports = SupportRouter;
