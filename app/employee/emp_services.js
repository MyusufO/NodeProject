const Employee = require("../models/employee_model");



const updateProfile = async (data) => {
    const { employeeId, name, email, phone } = data;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
        throw new Error("Employee not found");
    }

    if (email && email !== employee.email) {
        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            throw new Error("Email already exists");
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
        throw new Error("Employee not found");
    }
    return { message: "Employee profile deleted successfully" };
}

const getEmployeeDetails = async (employeeId) => {
    const employee = await Employee.findById(employeeId).populate("role").populate("dept");
    if (!employee) {
        throw new Error("Employee not found");
    }
    return employee;
}

const searchEmployees = async (query) => {
    const { name, email, phone, role, department } = query;
    if (!name && !email && !phone && !role && !department) {
        throw new Error("At least one search parameter is required");
    }
    let findQuery = {};
    if(name){
        findQuery.name = { $regex: name, $options: "i" };
    }
    if(email){
        findQuery.email = { $regex: email, $options: "i" };
    }
    if(phone){
        findQuery.phone = { $regex: phone, $options: "i" };
    }
    if(role){
        findQuery.role = role;
    }
    if(department){
        findQuery.dept = department;
    }
    const employees = await Employee.find(findQuery);
    return employees;
}
module.exports = {
    updateProfile,
    DeleteProfile,
    getEmployeeDetails,
    searchEmployees,
};