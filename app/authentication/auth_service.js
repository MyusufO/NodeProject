const Employee = require("../models/employee_model");
const Role = require("../models/role_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (data) => {

  const { name, email, phone, password } = data;

  const existingEmployee = await Employee.findOne({ email });

  if (existingEmployee) {
    const error = new Error("Employee already exists");
    error.statusCode = 409; 
    throw error;
  }

  const existingPhone = await Employee.findOne({ phone });

  if (existingPhone) {
    const error = new Error("Phone number already exists");
    error.statusCode = 409; 
    throw error;
  }

  const employeeRole = await Role.findOne({
    roleName: "Employee",
  });

  if (!employeeRole) {
    const error = new Error("Default Employee role not found");
    error.statusCode = 500; 
    throw error;
  }

  const password_hash = await bcrypt.hash(password, 10);

  const employee = await Employee.create({
    name,
    email,
    phone,
    password_hash,
    role: employeeRole._id,
  });

  return {
    message: "Employee registered successfully",
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employeeRole._id,
    },
  };
};



const loginUser = async (data) => {

  const { email, password } = data;

  const employee = await Employee.findOne({ email }).populate("role");

  if (!employee) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(
    password,
    employee.password_hash
  );

  if (!passwordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      employee_id: employee._id,
      role: employee.role.roleName,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return {
    message: "Login successful",
    token,
    employee: {
      id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role.roleName,
    },
  };
};


module.exports = {
  registerUser,
  loginUser
}