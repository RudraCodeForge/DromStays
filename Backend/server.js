require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const AuthRouter = require("./routes/AuthRouter");
const UserRouter = require("./routes/UserRouter");
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

app.get("/reviews", (req, res) => {
  const reviews = [
    {
      Icon: "",
      Name: "Siddhart Kumar",
      Title: "Happy Renter",
      Desc: '"Finding a room through DroomStays was a breeze! The process was transparent and much faster than any other site I\'ve used. Highly recommended!"',
      Rating: 5,
    },
    {
      Icon: "",
      Name: "Sonu Prajapati",
      Title: "Happy Renter",
      Desc: '"Excellent platform for finding rental properties. The listings are detailed, and the secure payment system made me feel safe throughout the process."',
      Rating: 4,
    },
    {
      Icon: "",
      Name: "Prince Daksh",
      Title: "Property Owner",
      Desc: '"As a landlord, DroomStays has simplified managing my properties. The secure payment system gives me peace of mind, and the platform is user-friendly."',
      Rating: 4,
    },
  ];

  res.json(reviews);
});

// ------------------ SERVER START ------------------ //
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
