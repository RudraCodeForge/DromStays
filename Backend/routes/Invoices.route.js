const express = require("express");
const InvoiceRouter = express.Router();
const InvoiceController = require("../controllers/Invoice.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

InvoiceRouter.get(
    "/",
    authMiddleware,
    InvoiceController.getAllInvoices,
);

module.exports = InvoiceRouter;