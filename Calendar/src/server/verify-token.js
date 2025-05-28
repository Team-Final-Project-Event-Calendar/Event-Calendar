import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: "Invalid token" });

    req.user = decoded;
    next();
  });
}



export function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== 'admin') {
          return res.status(403).json({ message: 'Admins only' });
      }
      req.user = decoded;
      next();
  } catch (err) {
      return res.status(400).json({ message: 'Invalid token' });
  }
}