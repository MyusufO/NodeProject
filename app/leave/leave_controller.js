const leaveService = require("./leave_service");
const Employee = require("../models/employee_model");

const createLeave = async (req, res) => {
    try {
        const employeeId = req.user.employee_id;

        const startDate = new Date(req.body.startDate);
        const endDate = new Date(req.body.endDate);

        if (startDate > endDate) {
            return res.status(400).json({
                message: "Start date cannot be after end date",
            });
        }

        const leaveData = {
            employee: employeeId,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            leaveType: req.body.leaveType,
            reason: req.body.reason,
        };

        const leave = await leaveService.createLeave(leaveData);

        return res.status(201).json(leave);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

const cancelLeave = async (req, res) => {
    try {
        const leave = await leaveService.cancelLeave(
            req.params.id,
            req.user.employee_id
        );

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
        const manager = await Employee.findById(
            req.user.employee_id
        ).populate("role");

        if (!manager) {
            return res.status(404).json({
                message: "Manager not found",
            });
        }

        if (manager.role?.roleName !== "Manager") {
            return res.status(403).json({
                message: "You are not authorized to change leave status",
            });
        }

        const { status, remarks } = req.body;

        if (!["Approved", "Rejected"].includes(status)) {
            return res.status(400).json({
                message: "Invalid leave status",
            });
        }

        const leave = await leaveService.leaveStatus(
            req.params.id,
            status,
            req.user.employee_id,
            remarks
        );

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
            req.user.employee_id
        );

        return res.status(200).json(balance);
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
const leaveHistory = async (req, res) => {
    try {
        const history = await leaveService.getLeaveHistory(
            req.user.employee_id
        );

        return res.status(200).json(history);
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
    leaveHistory
};