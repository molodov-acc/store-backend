import { Request, Response } from "express";
import { service } from "./categories.service";

const getAll = async (req: Request, res: Response) => {
  const categories = await service.getAll();
  res.json(categories);
};

const create = async (req: Request, res: Response) => {
  const category = await service.create(req.body.name);
  res.json(category);
};

export const controller = {
  getAll,
  create,
};
