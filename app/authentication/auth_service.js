const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Employee = require("../models/employee_model");
const Role = require("../models/role_model");
const employeeRole = Role.findOne({ roleName: "Employee" });


const registerUser = async (data) => {

  const { name, email, phone, password } = data;

  const existingEmployee = await Employee.findOne({ email });

  if (existingEmployee) {
    throw new Error("Employee already exists");
  }
  const existingPhone= await Employee.findOne({phone});
  if(existingPhone){
    throw new Error("Phone Number Exists")
  }
  const employeeRole = await Role.findOne({
        roleName: "Employee",
    });
  
  if (!employeeRole) {
        throw new Error("Default Employee role not found");
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
      role: employeeRole ? employeeRole._id : null,
    },
  };
};


const loginUser = async (data) => {

  const { email, password } = data;

  const employee = await Employee.findOne({ email }).populate("role");
  if (!employee) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    employee.password_hash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }
  console.log(employee);
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
  };
};


module.exports = {
  registerUser,
  loginUser,
};