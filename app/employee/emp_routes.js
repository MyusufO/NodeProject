const express = require("express");
const router = express.Router();

const authorize = require("../middleware/authorise");
const validateSchema = require("../middleware/validateSchema");
const upload = require("../middleware/filehandling");
const uploadProfilePicture = require("../middleware/imageUpload");
const jsonFileHandler = require("../middleware/jsonFileHandler");

const {
  updateProfileSchema,
  employeeIdSchema,
  searchEmployeeSchema,
  updateEmployeeRoleSchema,
  addEmployeeSchema,
} = require("../../validation/employeeValidation");

const {
  updateProfile,
  deleteProfile,
  deleteProfilePicture,
  getEmployeeDetails,
  searchEmployees,
  updateEmployeeRole,
  addEmployee,
} = require("./emp_controller");

router.post(
  "/",
  authorize("Admin"),
  upload.single("file"),
  jsonFileHandler({ key: "employees", required: false }),
  validateSchema(addEmployeeSchema),
  addEmployee
);

// Update profile (name/email/phone, optionally an avatar in the same request)
router.put(
  "/",
  uploadProfilePicture.single("avatar"),
  validateSchema(updateProfileSchema),
  updateProfile
);

// Remove profile picture only
router.delete("/profile-picture", deleteProfilePicture);

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