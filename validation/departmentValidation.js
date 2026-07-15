const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const createDepartmentSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .allow("")
    .optional(),
});

const updateDepartmentSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100),

  description: Joi.string()
    .trim()
    .allow("")
}).min(1);

const departmentIdSchema = Joi.object({
  id: objectId.required(),
});

const updateEmployeeDepartmentSchema = Joi.object({
  employeeId: objectId.required(),

  newDepartmentId: objectId.required(),
});

module.exports = {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentIdSchema,
  updateEmployeeDepartmentSchema,
};