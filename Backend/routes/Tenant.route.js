const express = require("express");
const TenantRouter = express.Router();
const TenantController = require("../controllers/Tenant.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

TenantRouter.post(
  "/addTenant",
  authMiddleware, // ✅ logged-in user
  TenantController.ADD_TENANT_TO_ROOM
);

module.exports = TenantRouter;
