const express = require("express");
const router = express.Router();

const {
    createLeave,
    cancelLeave,
    leaveStatus,
    leaveBalance,
} = require("./leave_controller");

router.post("/", createLeave);
router.delete("/:id", cancelLeave);
router.put("/:id/status", leaveStatus);
router.get("/:employeeId/balance", leaveBalance);

module.exports = router;