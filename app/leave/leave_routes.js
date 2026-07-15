const express = require("express");
const router = express.Router();

const authorize = require("../middleware/authorise");
const validateSchema = require("../middleware/validateSchema");

const {
  createLeaveSchema,
  cancelLeaveSchema,
  leaveStatusSchema,
  leaveBalanceSchema
} = require("../../validation/leaveValidation");

const {
  createLeave,
  cancelLeave,
  leaveStatus,
  leaveBalance,
  leaveHistory
} = require("./leave_controller");

// Apply leave
router.post(
  "/",
  validateSchema(createLeaveSchema),
  createLeave
);

// Cancel leave
router.delete(
  "/:id",
  validateSchema(cancelLeaveSchema, "params"),
  cancelLeave
);

// Approve/Reject leave (Manager only)
router.put(
  "/:id/status",
  authorize("Manager"),
  validateSchema(leaveStatusSchema),
  leaveStatus
);

// Leave balance
router.get(
  "/:employeeId/balance",
  validateSchema(leaveBalanceSchema, "params"),
  leaveBalance
);

router.get(
    "/history",
    leaveHistory
);
module.exports = router;