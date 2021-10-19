const Roles = require("../models/Role");

const userRole = async (role) => {
  const userRole = await Roles.findOne({ role }).select("role").lean();
  if (!userRole) {
    return res
      .status(400)
      .json({ message: "User Role not found!", success: false });
  }
  return userRole;
};

module.exports = userRole;
