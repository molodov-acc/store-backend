const { Server } = require("socket.io");

const chats = new Map();
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
      const chatId = `chat-${userId}-${Date.now()}`;

      chats.set(chatId, {
        status: "waiting",
        clientId: userId,
        operatorId: null,
      });

      socket.join(chatId);

      socket.emit("chat:init", { chatId });
      sendMessageToRoom(io, chatId, "server", "Привет! Ожидаем оператора.");

      io.to("operators").emit("chat:new", {
        chatId,
        clientId: userId,
        status: "waiting",
      });
    }

    // ================== Сообщения ==================
    socket.on("chat:message", ({ chatId, text }) => {
      if (!chatId || !text) return;

      // ❗ Проверка прав
      if (!socket.rooms.has(chatId)) {
        return;
      }

      const chat = chats.get(chatId);
      if (!chat) return;

      // 🚫 чат закрыт
      if (chat.status === "closed") return;

      sendMessageToRoom(io, chatId, role, text);
    });

    // ================== Подключение оператора к чату ==================
    socket.on("operator:join-chat", ({ chatId }) => {
      const chat = chats.get(chatId);
      if (!chat) return;

      // ❌ если чат закрыт
      if (chat.status === "closed") return;

      // ❌ если уже есть оператор
      if (chat.operatorId) return;

      // ✅ активируем чат
      chat.status = "active";
      chat.operatorId = userId;

      socket.join(chatId);
      socket.activeChats.add(chatId);

      io.to("operators").emit("chat:joined", {
        chatId,
        operatorId: userId,
        status: "active",
      });

      sendMessageToRoom(io, chatId, "server", "Оператор подключился к чату");
    });

    // ================== TYPING ==================
    socket.on("chat:typing:start", ({ chatId }) => {
      if (!socket.rooms.has(chatId)) return;

      const chat = chats.get(chatId);
      if (!chat || chat.status !== "active") return;

      // отправляем всем КРОМЕ отправителя
      socket.to(chatId).emit("chat:typing:start", {
        role,
        userId,
      });
    });

    socket.on("chat:typing:stop", ({ chatId }) => {
      if (!socket.rooms.has(chatId)) return;

      const chat = chats.get(chatId);
      if (!chat || chat.status !== "active") return;

      socket.to(chatId).emit("chat:typing:stop", {
        role,
        userId,
      });
    });

    // ================== Отключение ==================
    socket.on("disconnect", () => {
      if (role === "operator") {
        socket.activeChats.forEach((chatId) => {
          const chat = chats.get(chatId);
          if (!chat) return;

          // освобождаем чат
          chat.status = "waiting";
          chat.operatorId = null;

          sendMessageToRoom(
            io,
            chatId,
            "server",
            "Оператор отключился. Ожидаем другого оператора."
          );

          io.to("operators").emit("chat:updated", {
            chatId,
            status: "waiting",
          });
        });
      }
      // ========== КЛИЕНТ ==========
      if (role === "client") {
        const chatId = [...socket.rooms].find((r) => r.startsWith("chat-"));
        if (!chatId) return;

        const chat = chats.get(chatId);
        if (!chat) return;

        chat.status = "closed";

        sendMessageToRoom(
          io,
          chatId,
          "server",
          "Клиент покинул чат. Диалог закрыт."
        );

        io.to("operators").emit("chat:closed", { chatId });
      }
    });
    // ================== Закрытие ==================
    socket.on("chat:close", ({ chatId }) => {
      const chat = chats.get(chatId);
      if (!chat) return;

      // 🔐 только оператор
      if (role !== "operator") return;

      // 🔐 оператор должен быть назначен
      if (chat.operatorId !== userId) return;

      // ❌ если уже закрыт
      if (chat.status === "closed") return;

      chat.status = "closed";

      sendMessageToRoom(io, chatId, "server", "Чат закрыт оператором");

      io.to("operators").emit("chat:closed", { chatId });
    });
  });

  return io;
}

module.exports = { initSocket };
