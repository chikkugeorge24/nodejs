const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET } = require("../config");
const Admin = require("../models/Admin");
const {
  adminRegisterValidations,
  adminLoginValidations,
} = require("../validations");

const adminRegister = async (userData, role, res) => {
  //validate payload
  const { error = "" } = adminRegisterValidations(userData);
  if (error) {
    return res
      .status(400)
      .json({ message: error.details[0].message, success: false });
  }

  //validate admin
  const admin = await validateUsername(userData["username"]);
  if (!admin) {
    return res
      .status(400)
      .json({ message: "Admin already exists!", success: false });
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(userData["password"], salt);

  //create new admin
  const newAdmin = new Admin({
    ...userData,
    role,
    password: hashPassword,
  });

  try {
    console.log(newAdmin);
    await newAdmin.save();
    return res
      .status(201)
      .json({ message: "Admin registered successfully.", success: true });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unable to create your account", success: false });
  }
};

const validateUsername = async (username) => {
  const isUserExists = await Admin.findOne({ username })
    .select("username")
    .lean();
  return isUserExists ? false : true;
};

const adminLogin = async (userData, role, res) => {
  const { username = "", password: newPassword = "" } = userData;

  //validate payload
  const { error = "" } = adminLoginValidations(userData);
  if (error) {
    return res
      .status(400)
      .json({ message: error.details[0].message, success: false });
  }

  //checking if user already exists or not
  const user = await Admin.findOne({ username })
    .select("username password")
    .lean();
  if (!user) {
    return res
      .status(400)
      .json({ message: "User not found. Invalid login!", success: false });
  }

  const isPasswordValid = await bcrypt.compare(newPassword, user["password"]);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ message: "Invalid Password!", success: false });
  }

  const { password, ...rest } = user;
  rest["role"] = role;

  //create and assign a Token
  const token = jwt.sign(rest, SECRET, {
    expiresIn: "12h",
  });

  return res
    .header("auth-token", token)
    .json({ user: rest, message: "Successfully logged In.", success: true });
};

module.exports.adminRegister = adminRegister;
module.exports.adminLogin = adminLogin;
