import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): asserts req is AuthenticatedRequest => {
  const header = req.headers.authorization;
  if (!header) {
    throw new AppError("Unauthorized", 401);
  }

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    throw new AppError("Unauthorized", 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    (req as AuthenticatedRequest).user = decoded;

    next();
  } catch {
    throw new AppError("Invalid token", 401);
  }
};
