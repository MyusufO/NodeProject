const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const newRoute = require("./app/authentication/auth_routes.js");
const departmentRoute = require("./app/department/dept_routes.js");
const leaveRoute = require("./app/leave/leave_routes.js");
const connectDB = require("./config.js");
const port= process.env.PORT;

connectDB();

app.use(express.json());
app.use("/Users", newRoute);
app.use("/Departments", departmentRoute);
app.use("/Leaves", leaveRoute);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
