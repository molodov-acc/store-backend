import { Router } from "express";
import { controller } from "./categories.controller";

export const router = Router();

router.get("/", controller.getAll);
