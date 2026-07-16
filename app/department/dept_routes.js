const express = require("express");
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  updateEmployeeDepartment
} = require('./dept_controller');
const authenticateJWT = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorise");
const validateSchema = require("../middleware/validateSchema");

const {
  createDepartmentSchema,
  updateDepartmentSchema,
  departmentIdSchema,
  updateEmployeeDepartmentSchema,
} =require("../../validation/departmentValidation");

router.get("/", getAllDepartments);
router.get(
  "/:id",
  validateSchema(departmentIdSchema, "params"),
  getDepartmentById
);
router.post(
  "/",
  authorize("Admin"),
  validateSchema(createDepartmentSchema),
  createDepartment
);
router.put(
  "/:id",
  authorize("Admin"),
  validateSchema(updateDepartmentSchema),
  updateDepartment
);
router.delete(
  "/:id",
  authenticateJWT,
  authorize("Admin"),
  validateSchema(departmentIdSchema, "params"),
  deleteDepartment
);
router.put(
  "/employees/:empId/departments/:deptId",
  authenticateJWT,
  authorize("Admin"),
  validateSchema(updateEmployeeDepartmentSchema),
  updateEmployeeDepartment
);
module.exports = router;