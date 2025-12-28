import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { service } from "./products.service";

interface ProductQuery {
  gender?: string;
  size?: string;
  category?: string;
  brandId?: string;
  color?: string;
}

const getAll = (req: Request<{}, {}, {}, ProductQuery>, res: Response) => {
  const products = service.getAll(req.query);

  res.json(products);
};

const getById = (req: Request, res: Response) => {
  const product = service.getById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json(product);
};

export const controller = {
  getAll,
  getById,
};
