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
        throw new Error("Leave overlaps with an existing leave.");
    }

    return await Leave.create(leaveData);
};

const cancelLeave = async (id, employeeId) => {

    const leave = await Leave.findById(id);

    if (!leave) {
        throw new Error("Leave not found");
    }

    if (leave.employee.toString() !== employeeId) {
        throw new Error("Unauthorized");
    }

    if (leave.status === "Cancelled") {
        throw new Error("Leave already cancelled");
    }

    if (leave.status === "Rejected") {
        throw new Error("Rejected leave cannot be cancelled");
    }

    if (new Date() >= leave.startDate) {
        throw new Error("Cannot cancel after leave has started");
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
        throw new Error("Leave not found");
    }

    if (leave.status !== "Pending") {
        throw new Error("Leave has already been processed");
    }

    if (!["Approved", "Rejected"].includes(status)) {
        throw new Error("Invalid status");
    }

    if (status === "Approved") {

        const employee = await Employee.findById(leave.employee);

        const days = calculateLeaveDays(
            leave.startDate,
            leave.endDate
        );

        if (employee.leaveBalance < days) {
            throw new Error("Insufficient leave balance");
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
        throw new Error("Employee not found");
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