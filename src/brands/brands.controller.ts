import { Request, Response } from "express";
import { service } from "./brands.service";

const getAll = (req: Request, res: Response) => res.json(service.getAll());
const create = (req: Request, res: Response) =>
  res.json(service.create(req.body.name));

export const controller = {
  getAll,
  create,
};
