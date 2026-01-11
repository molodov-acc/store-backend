import { Request, Response } from "express";
import { z } from "zod";
import { service } from "./promotions.service";

const getAll = async (_: Request, res: Response) => {
  const data = await service.getAll();

  res.json(data);
};

const create = async (req: Request, res: Response) => {
  try {
    // const promotion = await service.create(req.body);
    //res.status(201).json(promotion);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.json(err.message);
    }
  }
};

export const controller = {
  getAll,
  create,
};
