const Department = require("../models/dept_model");
const Employee = require("../models/employee_model");

const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDepartments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const departments = await Department.find()
      .skip(skip)
      .limit(limitNumber);

    const totalDepartments = await Department.countDocuments();

    res.status(200).json({
      currentPage: pageNumber,
      totalPages: Math.ceil(totalDepartments / limitNumber),
      totalDepartments,
      departments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployeeDepartment = async (req, res) => {
  try {
    const { employeeId, newDepartmentId } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const department = await Department.findById(newDepartmentId);

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    employee.department = department._id;
    await employee.save();

    res.status(200).json({
      message: "Employee department updated successfully",
      employee,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  updateEmployeeDepartment,
};