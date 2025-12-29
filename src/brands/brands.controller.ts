import { Request, Response } from "express";
import { service } from "./brands.service";

const getAll = async (req: Request, res: Response) => {
  const r = await service.getAll();
  res.json(r);
};
const create = async (req: Request, res: Response) => {
  const f = await service.create(req.body.name);
  res.json(f);
};

export const controller = {
  getAll,
  create,
};
