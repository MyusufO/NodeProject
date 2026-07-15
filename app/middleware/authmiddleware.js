const jwt = require("jsonwebtoken");


const authenticateJWT = (req, res, next) => {

    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header missing"
        });
    }

    // Expect: Bearer <token>
    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Invalid token format"
        });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    try {

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store user info
        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateJWT;