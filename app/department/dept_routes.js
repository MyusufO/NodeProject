const express = require("express");
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  UpdateEmployeeDepartment
} = require('./dept_controller');

router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);
router.put("/employees/:empId/departments/:deptId", UpdateEmployeeDepartment);

module.exports = router;