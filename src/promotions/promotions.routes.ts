import { Router } from "express";
import { controller } from "./promotions.controller";

export const promotionsRouter = Router();

//TODO добавить роуты для изменения и удаления акции
promotionsRouter.get("/", controller.getAll);
promotionsRouter.post("/", controller.create);
