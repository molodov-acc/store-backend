import express from "express";
import { router as productsRoutes } from "./products/products.routes";
import { router as authRoutes } from "./auth/auth.routes";
import { router as cartRoutes } from "./cart/cart.routes";
import { router as categoriesRoutes } from "./categories/categories.routes";
import { router as brandsRoutes } from "./brands/brands.routes";
import { errorMiddleware } from "./middlewares/error";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/auth", authRoutes);
  app.use("/products", productsRoutes);
  app.use("/cart", cartRoutes);
  app.use("/categories", categoriesRoutes);
  app.use("/brands", brandsRoutes);

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use(errorMiddleware);

  return app;
}
