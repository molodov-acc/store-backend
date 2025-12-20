const express = require("express");
const productsRoutes = require("./products/products.routes");
const authRoutes = require("./auth/auth.routes");
const cartRoutes = require("./cart/cart.routes");
const categoriesRoutes = require("./categories/categories.routes");
const brandsRoutes = require("./brands/brands.routes");
const errorMiddleware = require("./middlewares/error");

function createApp() {
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

module.exports = { createApp };
