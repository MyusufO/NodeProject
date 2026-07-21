const express = require("express");
const authenticateJWT = require("./app/middleware/authMiddleware");
const dotenv = require("dotenv").config();
const app = express();
const userRoute = require("./app/authentication/auth_routes.js");
const departmentRoute = require("./app/department/dept_routes.js");
const leaveRoute = require("./app/leave/leave_routes.js");
const connectDB = require("./config.js");
const employeeRoute = require("./app/employee/emp_routes.js");
const errorHandler = require("./app/middleware/errorHandler.js");
const requestLogger = require("./app/middleware/requestLogger.js");
const port= process.env.PORT;

connectDB();

app.use(express.json());
app.use(requestLogger)
app.use("/employees",authenticateJWT, employeeRoute);
app.use("/Users", userRoute);
app.use("/Departments", authenticateJWT, departmentRoute);
app.use("/Leaves", authenticateJWT, leaveRoute);
app.use(errorHandler)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
