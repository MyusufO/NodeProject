const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .min(8)
    .max(30)
    .required(),

  phone: Joi.string()
    .pattern(/^[6-9][0-9]{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid 10-digit Indian mobile number",
    }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};