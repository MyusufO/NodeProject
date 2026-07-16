const Employee = require("../models/employee_model");
const getPagination=require("../middleware/pagination")


const updateProfile = async (data) => {
    const { employeeId, name, email, phone } = data;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
        const error = new Error("Employee not found");
        error.statusCode = 404;
        throw error;
    }

    if (email && email !== employee.email) {
        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            const error = new Error("Email already exists");
            error.statusCode = 409;
            throw error;
        }

        employee.email = email;
    }

    if (name) {
        employee.name = name;
    }

    if (phone) {
        employee.phone = phone;
    }

    await employee.save();

    return employee;
};

const DeleteProfile = async (employeeId) => {
    const employee = await Employee.findByIdAndDelete(employeeId);
    if (!employee) {
        const error = new Error("Employee not found");
        error.statusCode = 404;
        throw error;
    }
    return { message: "Employee profile deleted successfully" };
}

const getEmployeeDetails = async (employeeId) => {
    const employee = await Employee.findById(employeeId).populate("role").populate("dept");
    if (!employee) {
        const error = new Error("Employee not found");
        error.statusCode = 404;
        throw error;
    }
    return employee;
}

const searchEmployees = async (query) => {
    const {
        name,
        email,
        phone,
        role,
        department,
        page = 1,
        limit = 10,
    } = query;

    if (!name && !email && !phone && !role && !department) {
        const error = new Error("At least one search parameter is required");
        error.statusCode = 400;
        throw error;
    }

    let findQuery = {};

    if (name) {
        findQuery.name = { $regex: name, $options: "i" };
    }

    if (email) {
        findQuery.email = { $regex: email, $options: "i" };
    }

    if (phone) {
        findQuery.phone = { $regex: phone, $options: "i" };
    }

    if (role) {
        findQuery.role = role;
    }

    if (department) {
        findQuery.dept = department;
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const employees = await Employee.find(findQuery)
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);

    const totalEmployees = await Employee.countDocuments(findQuery);

    return {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalEmployees / limitNumber),
        totalEmployees,
        employees,
    };
};

const updateEmployeeRole = async (employeeId, roleId) => {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
        const error = new Error("Employee not found");
        error.statusCode = 404;
        throw error;
    }
    employee.role = roleId;
    await employee.save();
    return employee;
};

module.exports = {
    updateProfile,
    DeleteProfile,
    getEmployeeDetails,
    searchEmployees,
    updateEmployeeRole,
};