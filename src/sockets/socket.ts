import { Server } from "socket.io";
import { auth } from "./middlewares/auth";
import { ROLES, SOCKET_EVENTS, CHAT_STATUSES, ROOMS } from "./constants";

const chats = new Map();
/**
 * Отправка сообщения в комнату
 */
function sendMessageToRoom(io, chatId, sender, text) {
  io.to(chatId).emit(SOCKET_EVENTS.CHAT.MESSAGE.NEW, {
    chatId,
    sender,
    text,
    createdAt: Date.now(),
  });
}

/**
 * Инициализация Socket.IO
 */
export function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use(auth);

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    const { role, userId } = socket;
    // Для операторов храним активные чаты
    if (role === ROLES.OPERATOR) {
      socket.join(ROOMS.OPERATORS);
      socket.activeChats = new Set();
    }

    // ================== Клиент ==================
    if (role === ROLES.CLIENT) {
      const chatId = `chat-${userId}-${Date.now()}`;

      chats.set(chatId, {
        status: CHAT_STATUSES.WAITING,
        clientId: userId,
        operatorId: null,
      });

      socket.join(chatId);

      socket.emit(SOCKET_EVENTS.CHAT.INIT, { chatId });
      sendMessageToRoom(io, chatId, "server", "Привет! Ожидаем оператора.");

      io.to(ROOMS.OPERATORS).emit(SOCKET_EVENTS.CHAT.NEW, {
        chatId,
        clientId: userId,
        status: CHAT_STATUSES.WAITING,
      });
    }

    // ================== Сообщения ==================
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.SEND, ({ chatId, text }) => {
      if (!chatId || !text) return;

      if (!socket.rooms.has(chatId)) {
        return;
      }

      const chat = chats.get(chatId);
      if (!chat) return;

      if (chat.status === CHAT_STATUSES.CLOSED) return;

      sendMessageToRoom(io, chatId, role, text);
    });

    // ================== Подключение оператора к чату ==================
    socket.on(SOCKET_EVENTS.OPERATOR.JOIN_CHAT, ({ chatId }) => {
      const chat = chats.get(chatId);
      if (!chat) return;

      if (chat.status === CHAT_STATUSES.CLOSED) return;

      if (chat.operatorId) return;

      chat.status = CHAT_STATUSES.ACTIVE;
      chat.operatorId = userId;

      socket.join(chatId);
      socket.activeChats.add(chatId);

      io.to(ROOMS.OPERATORS).emit(SOCKET_EVENTS.CHAT.JOINED, {
        chatId,
        operatorId: userId,
        status: CHAT_STATUSES.ACTIVE,
      });

      sendMessageToRoom(io, chatId, "server", "Оператор подключился к чату");
    });

    // ================== TYPING ==================
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_START, ({ chatId }) => {
      if (!socket.rooms.has(chatId)) return;

      const chat = chats.get(chatId);
      if (!chat || chat.status !== CHAT_STATUSES.ACTIVE) return;

      socket.to(chatId).emit(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_START, {
        role,
        userId,
      });
    });

    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_STOP, ({ chatId }) => {
      if (!socket.rooms.has(chatId)) return;

      const chat = chats.get(chatId);
      if (!chat || chat.status !== CHAT_STATUSES.ACTIVE) return;

      socket.to(chatId).emit(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_STOP, {
        role,
        userId,
      });
    });
    // ================== Закрытие ==================
    socket.on(SOCKET_EVENTS.CHAT.CLOSED, ({ chatId }) => {
      const chat = chats.get(chatId);
      if (!chat) return;

      if (role !== ROLES.OPERATOR) return;

      if (chat.operatorId !== userId) return;

      if (chat.status === CHAT_STATUSES.CLOSED) return;

      chat.status = CHAT_STATUSES.CLOSED;

      sendMessageToRoom(io, chatId, "server", "Чат закрыт оператором");

      io.to(ROOMS.OPERATORS).emit(SOCKET_EVENTS.CHAT.CLOSED, { chatId });
    });
    // ================== Отключение ==================
    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      if (role === ROLES.OPERATOR) {
        socket.activeChats.forEach((chatId) => {
          const chat = chats.get(chatId);
          if (!chat) return;

          // освобождаем чат
          chat.status = CHAT_STATUSES.WAITING;
          chat.operatorId = null;

          sendMessageToRoom(
            io,
            chatId,
            "server",
            "Оператор отключился. Ожидаем другого оператора."
          );

          io.to(ROOMS.OPERATORS).emit(SOCKET_EVENTS.CHAT.UPDATED, {
            chatId,
            status: CHAT_STATUSES.WAITING,
          });
        });
      }
      // ========== КЛИЕНТ ==========
      if (role === ROLES.CLIENT) {
        const chatId = [...socket.rooms].find((r) => r.startsWith("chat-"));
        if (!chatId) return;

        const chat = chats.get(chatId);
        if (!chat) return;

        chat.status = CHAT_STATUSES.CLOSED;

        sendMessageToRoom(
          io,
          chatId,
          "server",
          "Клиент покинул чат. Диалог закрыт."
        );

        io.to(ROOMS.OPERATORS).emit(SOCKET_EVENTS.CHAT.CLOSED, { chatId });
      }
    });
  });

  return io;
}
