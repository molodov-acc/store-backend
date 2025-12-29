import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

const validGenders = ["male", "female"];
const validCategories = ["snowboard", "ski", "boots", "clothes"];

interface QueryParams {
  gender?: string;
  size?: string;
  category?: string;
  brandId?: string;
  color?: string;
}

export const validateQuery = (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response,
  next: NextFunction
) => {
  const { gender, category } = req.query;

  if (gender && !validGenders.includes(gender)) {
    throw new AppError(`Invalid gender: ${gender}`, 400);
  }

  if (category && !validCategories.includes(category)) {
    throw new AppError(`Invalid category: ${category}`, 400);
  }

  next();
};
