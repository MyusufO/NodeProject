const authService = require("./auth_service");

const register = async (req, res,next) => {
  try {
    const result = await authService.registerUser(req.body);

    return res.status(201).json(result);
  } catch (error) {
    next(error)
  }
};


const login = async (req, res,next) => {
  try {
    const result = await authService.loginUser(req.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error)
  }
};


module.exports = {
  register,
  login,
};