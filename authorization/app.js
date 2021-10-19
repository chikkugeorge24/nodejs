const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");

const { DB, PORT } = require("./config");

const app = express();

//Import routes
const adminRoutes = require("./routes/admin");

//Connect to DB
connect(DB, () => {
  console.log("DB connected...");
});

//Middlewares
app.use(express.json());

//Route middlewares
app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
