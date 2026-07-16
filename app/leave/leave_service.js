const Leave = require("../models/leave_model");
const Employee = require("../models/employee_model");

const createLeave = async (leaveData) => {

    const overlap = await Leave.findOne({
        employee: leaveData.employee,
        status: { $in: ["Pending", "Approved"] },
        startDate: { $lte: leaveData.endDate },
        endDate: { $gte: leaveData.startDate }
    });

    if (overlap) {
        const error = new Error("Leave overlaps with an existing leave.");
        error.statusCode = 409;
        throw error;
    }

    return await Leave.create(leaveData);
};

const cancelLeave = async (id, employeeId) => {

    const leave = await Leave.findById(id);

    if (!leave) {
        const error = new Error("Leave not found");
        error.statusCode = 404;
        throw error;
    }

    if (leave.employee.toString() !== employeeId) {
        const error = new Error("Unauthorized");
        error.statusCode = 403;
        throw error;
    }

    if (leave.status === "Cancelled") {
        const error = new Error("Leave already cancelled");
        error.statusCode = 409;
        throw error;
    }

    if (leave.status === "Rejected") {
        const error = new Error("Rejected leave cannot be cancelled");
        error.statusCode = 409;
        throw error;
    }

    if (new Date() >= leave.startDate) {
        const error = new Error("Cannot cancel after leave has started");
        error.statusCode = 400;
        throw error;
    }

    if (leave.status === "Approved") {

        const employee = await Employee.findById(employeeId);

        const days = calculateLeaveDays(
            leave.startDate,
            leave.endDate
        );

        employee.leaveBalance += days;

        await employee.save();
    }

    leave.status = "Cancelled";

    return await leave.save();
};

const calculateLeaveDays = (startDate, endDate) => {
    return (
        Math.ceil(
            (new Date(endDate) - new Date(startDate)) /
                (1000 * 60 * 60 * 24)
        ) + 1
    );
};

const leaveStatus = async (id, status, managerId, remarks = "") => {

    const leave = await Leave.findById(id);

    if (!leave) {
        const error = new Error("Leave not found");
        error.statusCode = 404;
        throw error;
    }

    if (leave.status !== "Pending") {
        const error = new Error("Leave has already been processed");
        error.statusCode = 409;
        throw error;
    }

    if (!["Approved", "Rejected"].includes(status)) {
        const error = new Error("Invalid status");
        error.statusCode = 400;
        throw error;
    }

    if (status === "Approved") {

        const employee = await Employee.findById(leave.employee);

        const days = calculateLeaveDays(
            leave.startDate,
            leave.endDate
        );

        if (employee.leaveBalance < days) {
            const error = new Error("Insufficient leave balance");
            error.statusCode = 400;
            throw error;
        }

        employee.leaveBalance -= days;

        await employee.save();
    }

    leave.status = status;
    leave.approvedBy = managerId;
    leave.remarks = remarks;

    return await leave.save();
};

const leaveBalance = async (employeeId) => {

    const employee = await Employee.findById(employeeId);

    if (!employee) {
        const error = new Error("Employee not found");
        error.statusCode = 404;
        throw error;
    }

    return {
        employeeId,
        leaveBalance: employee.leaveBalance
    };
};

const getLeaveHistory = async (employeeId) => {
    return await Leave.find({ employee: employeeId })
        .populate("approvedBy", "name email")
        .sort({ createdAt: -1 });
};

module.exports = {
    createLeave,
    cancelLeave,
    leaveStatus,
    leaveBalance,
    getLeaveHistory
};