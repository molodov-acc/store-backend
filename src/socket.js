const { Server } = require("socket.io");

/**
 * Отправка сообщения в комнату
 */
function sendMessageToRoom(io, chatId, sender, text) {
  io.to(chatId).emit("chat:message", {
    chatId,
    sender,
    text,
    createdAt: Date.now(),
  });
}

/**
 * Инициализация Socket.IO
 */
function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    const { userId, role } = socket.handshake.auth;
    socket.userId = userId;
    socket.role = role;

    // Для операторов храним активные чаты
    if (role === "operator") {
      socket.join("operators");
      socket.activeChats = new Set();
    }

    // ================== Клиент ==================
    if (role === "client") {
      const chatId = `chat-${userId}`;
      socket.join(chatId);

      // Инициализация чата для клиента
      socket.emit("chat:init", { chatId });
      sendMessageToRoom(io, chatId, "server", "Привет! Ты в чате.");

      // Уведомляем операторов о новом чате
      io.to("operators").emit("chat:new", { chatId, clientId: userId });
    }

    // ================== Сообщения ==================
    socket.on("chat:message", ({ chatId, text }) => {
      if (!chatId || !text) return;
      sendMessageToRoom(io, chatId, role, text);
    });

    // ================== Подключение оператора к чату ==================
    socket.on("operator:join-chat", ({ chatId }) => {
      if (!chatId) return;

      socket.join(chatId);
      socket.activeChats.add(chatId);

      // Оповещаем всех операторов, что чат присоединён
      io.to("operators").emit("chat:joined", { chatId, operatorId: userId });

      // Уведомляем клиента, что оператор подключился
      sendMessageToRoom(io, chatId, "server", "Оператор подключился к чату");
    });

    // ================== Отключение ==================
    socket.on("disconnect", () => {
      if (role === "operator") {
        // Для всех активных чатов оператора уведомляем клиентов
        socket.activeChats.forEach((chatId) => {
          sendMessageToRoom(io, chatId, "server", "Оператор покинул чат");
        });
      }
    });
  });

  return io;
}

module.exports = { initSocket };
