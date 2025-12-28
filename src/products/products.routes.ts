import { Router } from "express";
import { controller } from "./products.controller";
import { validateQuery } from "../middlewares/validateQuery";

export const router = Router();

router.get("/", validateQuery, controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.createProduct);
