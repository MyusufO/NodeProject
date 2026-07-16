const Department = require("../models/dept_model");
const Employee = require("../models/employee_model");

const createDepartment = async (req) => {
    return await Department.create(req.body);
};

const getDepartments = async (req) => {

    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const departments = await Department.find()
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const totalDepartments = await Department.countDocuments();

    return {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalDepartments / limitNumber),
        totalDepartments,
        departments,
    };
};

const getDepartmentById = async (req) => {

    const department = await Department.findById(req.params.id);

    if (!department) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }

    return department;
};

const updateDepartment = async (req) => {

    const department = await Department.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!department) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }

    return department;
};

const deleteDepartment = async (req) => {

    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        message: "Department deleted successfully",
    };
};

const updateEmployeeDepartment = async (req) => {

    const { employeeId, newDepartmentId } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
        const error = new Error("Employee not found");
        error.statusCode = 404;
        throw error;
    }

    const department = await Department.findById(newDepartmentId);

    if (!department) {
        const error = new Error("Department not found");
        error.statusCode = 404;
        throw error;
    }

    employee.department = department._id;
    await employee.save();

    return {
        message: "Employee department updated successfully",
        employee,
    };
};

module.exports = {
    createDepartment,
    getDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    updateEmployeeDepartment,
};