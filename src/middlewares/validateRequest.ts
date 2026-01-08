import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { AppError } from "../errors/AppError";

export const validateRequest =
  <T>(schema: ZodType<T>) =>
  (req: Request, _: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body) as T;
      next();
    } catch (err) {
      next(new AppError("Неккоректные данные", 400));
    }
  };
