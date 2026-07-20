const express = require("express");
const router = express.Router();
 
const authorize = require("../middleware/authorise");
const validateSchema = require("../middleware/validateSchema");
const upload = require("../middleware/filehandling");
const jsonFileHandler = require("../middleware/jsonFileHandler");
 
const {
  updateProfileSchema,
  employeeIdSchema,
  searchEmployeeSchema,
  updateEmployeeRoleSchema,
  bulkAddEmployeeSchema,
} = require("../../validation/employeeValidation");
 
const {
  updateProfile,
  deleteProfile,
  getEmployeeDetails,
  searchEmployees,
  updateEmployeeRole,
  addEmployees,
} = require("./emp_controller");
 
// Bulk add employees via JSON file upload (Admin only)
router.post(
  "/bulk",
  authorize("Admin"),
  upload.single("file"),
  jsonFileHandler({ key: "employees" }),
  validateSchema(bulkAddEmployeeSchema),
  addEmployees
);
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