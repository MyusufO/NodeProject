const employeeService = require("./emp_services");

const updateProfile = async (req, res) => {
    try {
        const employee = await employeeService.updateProfile(req.body);

        return res.status(200).json({
            message: "Profile updated successfully",
            employee,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            Sample: req.body,
        });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const result = await employeeService.DeleteProfile(req.params.employeeId);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
};

const getEmployeeDetails = async (req, res) => {
    try {
        const employee = await employeeService.getEmployeeDetails(
            req.params.employeeId
        );

        return res.status(200).json(employee);
    } catch (error) {
        return res.status(404).json({
            message: error.message,
        });
    }
};

const searchEmployees = async (req, res) => {
    try {
        const employees = await employeeService.searchEmployees(req.query);

        return res.status(200).json(employees);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    updateProfile,
    deleteProfile,
    getEmployeeDetails,
    searchEmployees,
};