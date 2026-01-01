import express from "express";
import cors from "cors";
import { router as productsRoutes } from "./products/products.routes";
import { router as authRoutes } from "./auth/auth.routes";
import { router as cartRoutes } from "./cart/cart.routes";
import { router as categoriesRoutes } from "./categories/categories.routes";
import { router as brandsRoutes } from "./brands/brands.routes";
import { promotionsRouter } from "./promotions/promotions.routes";
import { errorMiddleware } from "./middlewares/error";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5174",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.static("public"));

  app.use("/auth", authRoutes);
  app.use("/products", productsRoutes);
  app.use("/cart", cartRoutes);
  app.use("/categories", categoriesRoutes);
  app.use("/brands", brandsRoutes);
  app.use("/promotions", promotionsRouter);

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use(errorMiddleware);

  return app;
}
