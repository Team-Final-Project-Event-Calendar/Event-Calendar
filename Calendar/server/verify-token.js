import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT token from Authorization header.
 * If valid, attaches decoded user data to req.user.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 */
export default function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });

    req.user = decoded;
    next();
  });
}

/**
 * Middleware to verify JWT token and check if user role is 'admin'.
 * If valid and role is admin, attaches decoded user data to req.user.
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 */
export function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token" });
  }
}
