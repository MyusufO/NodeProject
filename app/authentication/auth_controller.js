const authService = require("./auth_service");

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};


const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      error: error.message,
    });
  }
};


module.exports = {
  register,
  login,
};