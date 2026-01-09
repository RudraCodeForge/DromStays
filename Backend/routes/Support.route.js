const express = require("express");
const SupportRouter = express.Router();
const SupportController = require("../controllers/Support.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

// Route to handle contact support form submission
SupportRouter.post("/contact", SupportController.contactSupport);
// Route to handle ticket creation
SupportRouter.post("/tickets", authMiddleware, SupportController.createTicket);

// Route to get all tickets for the authenticated user
SupportRouter.get("/tickets", authMiddleware, SupportController.getTickets);
// Route to get details of a specific ticket
SupportRouter.get(
  "/tickets/:ticketId",
  authMiddleware,
  SupportController.getTicketDetails
);
SupportRouter.post(
  "/tickets/:ticketId/message",
  authMiddleware,
  SupportController.sendTicketMessage
);
module.exports = SupportRouter;
