import { Router } from "express";
import { controller } from "./brands.controller";

export const router = Router();

router.get("/", controller.getAll);
router.post("/", controller.create);
