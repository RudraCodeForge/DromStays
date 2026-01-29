require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const AuthRouter = require("./routes/Auth.route");
const UserRouter = require("./routes/User.route");
const ReviewRouter = require("./routes/Review.route");
const SubscriptionRouter = require("./routes/Subscription.route");
const PropertyRouter = require("./routes/Property.route");
const RoomRouter = require("./routes/Room.route");
const RecentRouter = require("./routes/Recent.route");
const TenantRouter = require("./routes/Tenant.route");
const PaymentRouter = require("./routes/Payment.route");
const SupportRouter = require("./routes/Support.route");
const FavouriteRouter = require("./routes/Favourite.route");
const RequestRouter = require("./routes/Request.route");
const SessionRouter = require("./routes/Session.route");
const InvoiceRouter = require("./routes/Invoices.route");
const NotificationRouter = require("./routes/Notification.route");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ exact frontend URL
    credentials: true, // ✅ allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use("/properties", PropertyRouter);
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/reviews", ReviewRouter);
app.use("/subscriptions", SubscriptionRouter);
app.use("/rooms", RoomRouter);
app.use("/activities", RecentRouter);
app.use("/tenants", TenantRouter);
app.use("/payments", PaymentRouter);
app.use("/support", SupportRouter);
app.use("/favourites", FavouriteRouter);
app.use("/requests", RequestRouter);
app.use("/sessions", SessionRouter);
app.use("/invoices", InvoiceRouter);
app.use("/notifications", NotificationRouter);
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ------------------ MONGO DB CONNECTION ------------------ //
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MONGO DB CONNECTED SUCCESSFULLY");
  })
  .catch((err) => {
    console.log("ERROR WHILE CONNECTING TO MONGO DB :", err);
  });

// ------------------ ROUTES ------------------ //
app.get("/", (req, res) => {
  res.send("Backend Working");
});

// ------------------ SERVER START ------------------ //
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
