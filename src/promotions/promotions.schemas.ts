import z from "zod";

export const createPromotionSchema = z.object({
  title: z.string().min(1),
  discountValue: z.number().positive(),
  active: z.boolean(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date))),
  description: z.string().optional(),
  applicableProducts: z.array(z.string()).optional(),
});
