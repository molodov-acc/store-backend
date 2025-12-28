import dotenv from "dotenv";
import { createApp } from "./app";
import { initSocket } from "./sockets/socket";

dotenv.config();

const app = createApp();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

initSocket(server);
