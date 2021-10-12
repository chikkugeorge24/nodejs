const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const { registerValidations } = require("../validations");

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

router.post("/login", (req, res) => {
  res.send("Login");
});

module.exports = router;
