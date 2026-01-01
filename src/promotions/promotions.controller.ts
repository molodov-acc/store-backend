import { Request, Response } from "express";
import { z } from "zod";
import { service } from "./promotions.service";

const createPromotionSchema = z.object({
  title: z.string().min(1),
  discountValue: z.number().positive(),
  active: z.boolean(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  description: z.string().optional(),
  applicableProducts: z.array(z.string()).optional(),
});

const getAll = async (_: Request, res: Response) => {
  const data = await service.getAll();

  res.json(data);
};

const create = async (req: Request, res: Response) => {
  try {
    const data = createPromotionSchema.parse(req.body);
    const promotion = await service.create(data);

    res.status(201).json(promotion);
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
