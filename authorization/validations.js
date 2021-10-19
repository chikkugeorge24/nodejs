const Joi = require("@hapi/joi");

const adminRegisterValidations = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

const adminLoginValidations = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = {
  adminLoginValidations,
  adminRegisterValidations,
};
