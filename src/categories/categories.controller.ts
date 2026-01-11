import { Request, Response } from "express";
import { service } from "./categories.service";

const getAll = async (req: Request, res: Response) => {
  const categories = await service.getAll();
  res.json(categories);
};

export const controller = {
  getAll,
};
