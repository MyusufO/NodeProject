const employeeService = require("./emp_services");

const updateProfile = async (req, res,next) => {
    try {
        const employee = await employeeService.updateProfile(req.body);

        return res.status(200).json({
            message: "Profile updated successfully",
            employee,
        });
    } catch (error) {
        next(error)
    }
};

const deleteProfile = async (req, res,next) => {
    try {
        const result = await employeeService.DeleteProfile(req.params.employeeId);

        return res.status(200).json(result);
    } catch (error) {
        next(error)
    }
};

const getEmployeeDetails = async (req, res,next) => {
    try {
        const employee = await employeeService.getEmployeeDetails(
            req.params.employeeId
        );

        return res.status(200).json(employee);
    } catch (error) {
        next(error)
    }
};

const searchEmployees = async (req, res,next) => {
    try {
        const employees = await employeeService.searchEmployees(req.query);

        return res.status(200).json(employees);
    } catch (error) {
        next(error)
    }
};

const updateEmployeeRole = async (req, res,next) => {
    try {
        const { employeeId, roleId } = req.body;
        const employee = await employeeService.updateEmployeeRole(employeeId, roleId);

        return res.status(200).json({
            message: "Employee role updated successfully",
            employee,
        });
    } catch (error) {
        next(error)
    }
};

const addEmployees = async (req, res,next) => {
    try {
        const result = await employeeService.bulkAddEmployees(req.body.employees);

        return res.status(201).json(result);
    } catch (error) {
        next(error)
    }
};

module.exports = {
    updateProfile,
    deleteProfile,
    getEmployeeDetails,
    searchEmployees,
    updateEmployeeRole,
    addEmployees,
};
