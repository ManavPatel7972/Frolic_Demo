const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

// Github - github.com/V-vidit/Frolic

app.use(
  cors({
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true,
  }),
);
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const instituteRoutes = require("./src/routes/institute");
const departmentRoutes = require("./src/routes/department");
const eventRoutes = require("./src/routes/event");
const groupRoutes = require("./src/routes/group");
const particpantRoutes = require("./src/routes/participant");
const eventWiseWinnerRoutes = require("./src/routes/eventWiseWinners");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/institute", instituteRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/participants", particpantRoutes);
app.use("/api/winners", eventWiseWinnerRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server at port number ${process.env.PORT}`);
});
