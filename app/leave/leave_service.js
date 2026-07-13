const Leave = require("../models/leave_model");
const Employee = require("../models/employee_model");

const createLeave = async (leaveData) => {
    return await Leave.create(leaveData);
};

const cancelLeave = async (id) => {
    return await Leave.findByIdAndDelete(id);
};

const leaveStatus = async (id, status) => {
    return await Leave.findByIdAndUpdate(
        id,
        { status },
        {
            new: true,
            runValidators: true,
        }
    );
};

const leaveBalance = async (employeeId) => {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
        throw new Error("Employee not found");
    }

    const leaves = await Leave.find({
        employee: employeeId,
        status: "Approved", // Match your schema exactly
    });

    let balance = employee.leaveBalance || 0;

    leaves.forEach((leave) => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);

        const duration =
            Math.ceil(
                (endDate - startDate) / (1000 * 60 * 60 * 24)
            ) + 1;

        balance -= duration;
    });

    return {
        employeeId,
        leaveBalance: balance,
    };
};

module.exports = {
    createLeave,
    cancelLeave,
    leaveStatus,
    leaveBalance,
};