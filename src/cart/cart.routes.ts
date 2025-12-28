import { Router } from "express";
import { controller } from "./cart.controller";
import { authMiddleware } from "../middlewares/auth";

export const router = Router();

router.get("/", authMiddleware, controller.getCart);
router.post("/", authMiddleware, controller.addToCart);
router.post("/clear", authMiddleware, controller.clearCart);
router.delete("/:productId", authMiddleware, controller.removeFromCart);
