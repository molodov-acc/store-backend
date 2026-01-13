import { Router } from "express";
import { controller } from "./promotions.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { createPromotionSchema } from "./promotions.schemas";

export const promotionsRouter = Router();

//TODO добавить роуты для изменения и удаления акции
promotionsRouter.get("/", controller.getAll);
promotionsRouter.post(
  "/",
  validateRequest(createPromotionSchema),
  controller.create
);
