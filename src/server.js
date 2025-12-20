require("dotenv").config();
const http = require("http");
const { createApp } = require("./app");
const { initSocket } = require("./socket");

const app = createApp();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

initSocket(server);
