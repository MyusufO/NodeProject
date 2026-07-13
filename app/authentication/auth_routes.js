const express = require("express");
const router = express.Router();
const {login, register} = require("./auth_controller");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Users route is working",
  });
});

router.post("/register", register);

router.post("/login", login);



module.exports = router;