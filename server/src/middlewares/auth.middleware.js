import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(" Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};
