const express = require("express");
const router = express.Router();

const { login, register } = require("./auth_controller");

const validateSchema = require("../middleware/validateSchema");

const {
  registerSchema,
  loginSchema,
} = require("../../validation/authValidation");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Users route is working",
  });
});

router.post(
  "/register",
  validateSchema(registerSchema),
  register
);

router.post(
  "/login",
  validateSchema(loginSchema),
  login
);

module.exports = router;