import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils.js";
import type { JWTPayload } from "../utils/jwt.utils.js";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction 
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }
    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      res.status(401).json({
        success: false,
        message: "Invalid token. Authorization denied.",
      });
      return;
    }

    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};
