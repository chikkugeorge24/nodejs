const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT || 5000;

dotenv.config();

//Import routes
const authRoute = require("./routes/auth");

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("DB connected...");
});

//Middlewares
app.use(express.json());

//Route middlewares
app.use("/api/user", authRoute);

const server = app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
