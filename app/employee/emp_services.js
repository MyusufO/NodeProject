const Employee = require("../models/employee_model");
const getPagination=require("../middleware/pagination")
const Role = require("../models/role_model");
const bcrypt = require("bcrypt");


const updateProfile = async (data) => {
  const { employeeId, name, email, phone, profilePicture } = data;

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

  if (name) employee.name = name;
  if (phone) employee.phone = phone;

  if (profilePicture) {
    // delete the old file before pointing to the new one
    if (employee.profilePicture) {
      const oldPath = path.join(__dirname, "..", "..", employee.profilePicture);
      await fs.unlink(oldPath).catch(() => {});
    }
    employee.profilePicture = profilePicture;
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

const addSingleEmployee = async (data) => {
    const { name, email, phone, password, dept } = data;

    const employeeRole = await Role.findOne({ roleName: "Employee" });

    if (!employeeRole) {
        const error = new Error("Default Employee role not found");
        error.statusCode = 500;
        throw error;
    }

    const duplicateQuery = phone
        ? { $or: [{ email }, { phone }] }
        : { email };

    const existingEmployee = await Employee.findOne(duplicateQuery);

    if (existingEmployee) {
        const error = new Error("Employee already exists");
        error.statusCode = 409;
        throw error;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
        name,
        email,
        phone,
        password_hash,
        dept: dept || null,
        role: employeeRole._id,
    });

    return {
        message: "Employee added successfully",
        employee: {
            id: employee._id,
            name: employee.name,
            email: employee.email,
        },
    };
};

const bulkAddEmployees = async (employees) => {
    const employeeRole = await Role.findOne({ roleName: "Employee" });

    if (!employeeRole) {
        const error = new Error("Default Employee role not found");
        error.statusCode = 500;
        throw error;
    }

    const created = [];
    const skipped = [];

    for (const entry of employees) {
        const { name, email, phone, password, dept } = entry;

        const duplicateQuery = phone
            ? { $or: [{ email }, { phone }] }
            : { email };

        const existingEmployee = await Employee.findOne(duplicateQuery);

        if (existingEmployee) {
            skipped.push({ email, reason: "Employee already exists" });
            continue;
        }

        const password_hash = await bcrypt.hash(password, 10);

        const employee = await Employee.create({
            name,
            email,
            phone,
            password_hash,
            dept: dept || null,
            role: employeeRole._id,
        });

        created.push({
            id: employee._id,
            name: employee.name,
            email: employee.email,
        });
    }

    return {
        message: `${created.length} employee(s) added, ${skipped.length} skipped`,
        created,
        skipped,
    };
};

const deleteProfilePicture = async (employeeId) => {
  const employee = await Employee.findById(employeeId);
  if (!employee) {
    const error = new Error("Employee not found");
    error.statusCode = 404;
    throw error;
  }

  if (employee.profilePicture) {
    const oldPath = path.join(__dirname, "..", "..", employee.profilePicture);
    await fs.unlink(oldPath).catch(() => {});
    employee.profilePicture = null;
    await employee.save();
  }

  return employee;
};

module.exports = {
    updateProfile,
    DeleteProfile,
    getEmployeeDetails,
    searchEmployees,
    updateEmployeeRole,
    addSingleEmployee,
    bulkAddEmployees,
    deleteProfilePicture
};