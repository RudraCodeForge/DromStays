require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const AuthRouter = require("./routes/AuthRouter");
const UserRouter = require("./routes/UserRouter");
const ReviewRouter = require("./routes/ReviewRouter");
const SubscriptionRouter = require("./routes/SubscriptionRouter");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ exact frontend URL
    credentials: true, // ✅ allow cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
app.use("/reviews", ReviewRouter);
app.use("/subscriptions", SubscriptionRouter);

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
