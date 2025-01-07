// middleware/authMiddleware.ts
import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};