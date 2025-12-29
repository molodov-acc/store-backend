import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { service } from "./products.service";
import { ProductQuery } from "./types";

const getAll = async (
  req: Request<{}, {}, {}, ProductQuery>,
  res: Response
) => {
  const products = await service.getAll(req.query);

  res.json(products);
};

const getById = async (req: Request, res: Response) => {
  const product = await service.getById(req.params.id);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json(product);
};

export const controller = {
  getAll,
  getById,
};
