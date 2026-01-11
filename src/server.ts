import { config } from "dotenv";
import { createApp } from "./app";
import { initSocket } from "./sockets/socket";
import { prisma } from "./prisma";

config();

const app = createApp();
const PORT = process.env.PORT || 3000;

async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection successful");
  } catch (error) {
    console.error("Cannot connect to database:", error);
    process.exit(1);
  }
}

async function startServer() {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });

    initSocket(server);
    // checkDatabaseConnection();
  } catch (err) {
    console.error("Ошибка подключения к БД:", err);
  }
}

startServer();
