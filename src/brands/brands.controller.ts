import { Request, Response } from "express";
import { service } from "./brands.service";

const getAll = async (req: Request, res: Response) => {
  res.json(await service.getAll());
};

export const controller = {
  getAll,
};
