import express from "express";
import cors from "cors";
import { router as productsRoutes } from "./products/products.routes";
import { router as authRoutes } from "./auth/auth.routes";
import { router as cartRoutes } from "./cart/cart.routes";
import { router as categoriesRoutes } from "./categories/categories.routes";
import { router as brandsRoutes } from "./brands/brands.routes";
import { errorMiddleware } from "./middlewares/error";

export function createApp() {
  const app = express();

  const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : [
        "http://localhost:5174",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
      ];

  app.use(
    cors({
      origin: allowedOrigins,
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

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use(errorMiddleware);

  return app;
}
