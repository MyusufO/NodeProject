const express = require("express");
const router = express.Router();

const {
    updateProfile,
    deleteProfile,
    getEmployeeDetails,
    searchEmployees,
} = require("./emp_controller");

router.put("/", updateProfile);

router.delete("/:employeeId", deleteProfile);

router.get("/:employeeId", getEmployeeDetails);

router.get("/search/filter", searchEmployees);

module.exports = router;