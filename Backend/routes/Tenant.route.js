const express = require("express");
const TenantRouter = express.Router();
const TenantController = require("../controllers/Tenant.Controller");
const authMiddleware = require("../middlewares/authMiddleware");

TenantRouter.post(
  "/addTenant",
  authMiddleware, // ✅ logged-in user
  TenantController.ADD_TENANT_TO_ROOM
);

TenantRouter.get(
  "/byRoomId/:roomId",
  authMiddleware, // ✅ logged-in user
  TenantController.GET_TENANTS_BY_ROOM_ID
);
TenantRouter.delete(
  "/:tenantId",
  authMiddleware, // ✅ logged-in user
  TenantController.DELETE_TENANT_BY_ID
);

module.exports = TenantRouter;
