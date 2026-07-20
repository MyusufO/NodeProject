const express = require("express");
const router = express.Router();

const authorize = require("../middleware/authorise");
const validateSchema = require("../middleware/validateSchema");
const upload = require("../middleware/filehandling"); // adjust path if needed

const {
  updateProfileSchema,
  employeeIdSchema,
  searchEmployeeSchema,
  updateEmployeeRoleSchema,
} = require("../../validation/employeeValidation");

const {
  updateProfile,
  deleteProfile,
  getEmployeeDetails,
  searchEmployees,
  updateEmployeeRole,
} = require("./emp_controller");

// Update profile
router.put(
  "/",
  validateSchema(updateProfileSchema),
  updateProfile
);

// Delete employee (Admin only)
router.delete(
  "/:employeeId",
  authorize("Admin"),
  validateSchema(employeeIdSchema, "params"),
  deleteProfile
);

// Search employees
router.get(
  "/search/filter",
  validateSchema(searchEmployeeSchema, "query"),
  searchEmployees
);

// Get employee details
router.get(
  "/:employeeId",
  validateSchema(employeeIdSchema, "params"),
  getEmployeeDetails
);

// Update employee role (Admin only)
router.put(
  "/role",
  authorize("Admin"),
  validateSchema(updateEmployeeRoleSchema),
  updateEmployeeRole
);

module.exports = router;