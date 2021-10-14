const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");
const { registerValidations, loginValidations } = require("../validations");

router.post("/register", async (req, res) => {
  //Validate payload
  const { error = "" } = registerValidations(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //Checking if user already exists or not
  const emailExist = await User.findOne({ email: req.body.email })
    .select("email")
    .lean();
  if (emailExist) {
    return res.status(400).send("Email already exists!");
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  //Validate payload
  const { error = "" } = loginValidations(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //Checking if user already exists or not
  const user = await User.findOne({ email: req.body.email })
    .select("email password")
    .lean();
  if (!user) {
    return res.status(400).send("Email is not registered!");
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    user["password"]
  );

  if (!isPasswordValid) {
    return res.status(400).send("Invalid Password!");
  }

  //Create and assign a Token
  const token = jwt.sign({ _id: user["_id"] }, process.env.SECRET_TOKEN);

  res.header("auth-token", token).send(token);
});

module.exports = router;
