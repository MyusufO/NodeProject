const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const updateProfileSchema = Joi.object({
  employeeId: objectId.required(),

  name: Joi.string().trim().min(2).max(100),

  email: Joi.string().email(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone number must contain exactly 10 digits",
    }),
}).min(2); // employeeId + at least one field to update

const employeeIdSchema = Joi.object({
  employeeId: objectId.required(),
});

const searchEmployeeSchema = Joi.object({
  name: Joi.string().trim(),

  email: Joi.string().email(),

  phone: Joi.string().pattern(/^[0-9]{10}$/),

  role: objectId,

  department: objectId,
}).min(1);

const updateEmployeeRoleSchema = Joi.object({
  employeeId: objectId.required(),

  roleId: objectId.required(),
});

const newEmployeeSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  email: Joi.string().email().required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone number must contain exactly 10 digits",
    }),

  password: Joi.string().min(6).required(),

  dept: objectId,
});

const bulkAddEmployeeSchema = Joi.object({
  employees: Joi.array().items(newEmployeeSchema).min(1).required(),
});

// Accepts either a single employee body OR { employees: [...] } from a JSON file upload
const addEmployeeSchema = Joi.alternatives().try(
  bulkAddEmployeeSchema,
  newEmployeeSchema
);

module.exports = {
  updateProfileSchema,
  employeeIdSchema,
  searchEmployeeSchema,
  updateEmployeeRoleSchema,
  newEmployeeSchema,
  bulkAddEmployeeSchema,
  addEmployeeSchema,
};