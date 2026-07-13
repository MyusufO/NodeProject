const leaveService = require("./leave_service");
const Employee = require("../models/employee_model");
const Role = require("../models/role_model");
const createLeave = async (req, res) => {
    try {
        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        if (startDate > endDate) {
            return res.status(400).json({
                message: "Start date cannot be after end date",
            });
        }

        const leave = await leaveService.createLeave(req.body);

        return res.status(201).json(leave);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
            req: req.body,
        });
    }
};

const cancelLeave = async (req, res) => {
    try {
        const leave = await leaveService.cancelLeave(req.params.id);

        if (!leave) {
            return res.status(404).json({
                message: "Leave not found",
            });
        }

        return res.status(200).json({
            message: "Leave cancelled successfully",
            leave,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const leaveStatus = async (req, res) => {
    try {
        const { employeeId, status } = req.body;

        const employee = await Employee.findById(employeeId).populate("role");

        console.log(employee);
        console.log(employee.role);
        console.log(employee.role?.roleName);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }
        if (
            employee.role.roleName !== "Manager"
        ) {
            return res.status(403).json({
                message: "You are not authorized to change leave status",
            });
        }

        if (!["Pending", "Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid leave status",
            });
        }

        const leave = await leaveService.leaveStatus(
            req.params.id,
            status
        );

        if (!leave) {
            return res.status(404).json({
                message: "Leave not found",
            });
        }

        return res.status(200).json({
            message: "Leave status updated successfully",
            leave,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const leaveBalance = async (req, res) => {
    try {
        const balance = await leaveService.leaveBalance(
            req.params.employeeId
        );

        return res.status(200).json(balance);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = {
    createLeave,
    cancelLeave,
    leaveStatus,
    leaveBalance,
};