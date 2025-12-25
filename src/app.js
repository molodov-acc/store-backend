const express = require("express");
const cors = require("cors");
const path = require("path");
const productsRoutes = require("./products/products.routes");
const authRoutes = require("./auth/auth.routes");
const cartRoutes = require("./cart/cart.routes");
const categoriesRoutes = require("./categories/categories.routes");
const brandsRoutes = require("./brands/brands.routes");
const errorMiddleware = require("./middlewares/error");

function createApp() {
  const app = express();

  // CORS настройка для фронтенда
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "*", // Укажите URL вашего фронтенда или "*" для всех
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Раздача статических файлов (изображений) - используем абсолютный путь
  const publicPath = path.join(__dirname, "..", "public");
  app.use("/images", express.static(path.join(publicPath, "images")));
  app.use(express.static(publicPath));

  // express.json() с условием для исключения multipart/form-data
  app.use((req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("multipart/form-data")) {
      return next();
    }
    express.json()(req, res, next);
  });

  app.use("/auth", authRoutes);
  app.use("/products", productsRoutes);
  app.use("/cart", cartRoutes);
  // Alias для обратной совместимости
  app.use("/carts", cartRoutes);
  app.use("/categories", categoriesRoutes);
  app.use("/brands", brandsRoutes);

  // Специальный маршрут для /carts.json
  app.get(
    "/carts.json",
    require("./middlewares/auth"),
    require("./cart/cart.controller").getCart
  );

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Отладочный маршрут для проверки статических файлов
  if (process.env.NODE_ENV !== "production") {
    app.get("/debug/images", (req, res) => {
      const fs = require("fs");
      const imagesPath = path.join(publicPath, "images", "products");
      try {
        const files = fs.readdirSync(imagesPath);
        res.json({
          path: imagesPath,
          files: files,
          publicPath: publicPath
        });
      } catch (error) {
        res.status(500).json({ error: error.message, path: imagesPath });
      }
    });
  }

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
