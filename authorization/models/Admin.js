const mongoose = require("mongoose");
const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
