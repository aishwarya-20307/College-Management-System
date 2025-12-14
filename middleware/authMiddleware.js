const jwt = require("jsonwebtoken");
const SECRET_KEY = "CMIS_SECRET_KEY";

function authMiddleware(req, res, next) {
  // Get token from headers: "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Access denied. No token provided." });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. Invalid token." });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info (email & role)
    next(); // proceed to route
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;