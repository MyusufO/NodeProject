const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const createLeaveSchema = Joi.object({
  startDate: Joi.date().required(),

  endDate: Joi.date()
    .greater(Joi.ref("startDate"))
    .required(),

  reason: Joi.string()
    .trim()
    .min(5)
    .max(500)
    .required(),
});

const cancelLeaveSchema = Joi.object({
  id: objectId.required(),
});

const leaveStatusSchema = Joi.object({
  status: Joi.string()
    .valid("Pending", "Approved", "Rejected")
    .required(),
});

const leaveBalanceSchema = Joi.object({
  employeeId: objectId.required(),
});

module.exports = {
  createLeaveSchema,
  cancelLeaveSchema,
  leaveStatusSchema,
  leaveBalanceSchema,
};