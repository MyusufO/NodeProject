const deptservice = require("./dept_service");

const getAllDepartments = async (req, res, next) => {
    try {
        const departments = await deptservice.getDepartments(req);
        res.status(200).json(departments);
    } catch (error) {
        next(error);
    }
};

const getDepartmentById = async (req, res, next) => {
    try {
        const department = await deptservice.getDepartmentById(req);
        res.status(200).json(department);
    } catch (error) {
        next(error);
    }
};

const createDepartment = async (req, res, next) => {
    try {
        const department = await deptservice.createDepartment(req);
        res.status(201).json(department);
    } catch (error) {
        next(error);
    }
};

const updateDepartment = async (req, res, next) => {
    try {
        const department = await deptservice.updateDepartment(req);
        res.status(200).json(department);
    } catch (error) {
        next(error);
    }
};

const deleteDepartment = async (req, res, next) => {
    try {
        const result = await deptservice.deleteDepartment(req);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const updateEmployeeDepartment = async (req, res, next) => {
    try {
        const result = await deptservice.updateEmployeeDepartment(req);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    updateEmployeeDepartment,
};