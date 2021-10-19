const router = require("express").Router();

const userRole = require("../utils/Role");
const { adminRegister, adminLogin } = require("../utils/Auth");
const { ROLES } = require("../common/constants");

const { ADMIN } = ROLES;

getAdminRole = async () => {
  const role = await userRole(ADMIN);
  return role;
};

router.post("/register", async (req, res) => {
  const userRole = await getAdminRole();
  const { _id: roleId = "" } = userRole;
  await adminRegister(req.body, roleId, res);
});

router.post("/login", async (req, res) => {
  const userRole = await getAdminRole();
  const { role = "" } = userRole;
  await adminLogin(req.body, role, res);
});

module.exports = router;
