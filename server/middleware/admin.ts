import { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if a user is authenticated and is an admin
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized - Please login" });
  }

  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Forbidden - Admin access required" });
  }

  next();
}