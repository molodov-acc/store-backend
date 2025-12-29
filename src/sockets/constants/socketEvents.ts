export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  CHAT: {
    INIT: "chat:init",
    NEW: "chat:new",
    JOINED: "chat:joined",
    UPDATED: "chat:updated",
    CLOSED: "chat:closed",
    CLOSE: "chat:close",

    MESSAGE: {
      SEND: "chat:message:send",
      NEW: "chat:message:new",
      TYPING_START: "chat:typing:start",
      TYPING_STOP: "chat:typing:stop",
    },
    ROOM: {
      JOIN: "chat:room:join",
      LEAVE: "chat:room:leave",
      USERS_UPDATE: "chat:room:users_update",
    },
  },

  OPERATOR: {
    AVAILABLE: "operator:available",
    JOIN_CHAT: "operator:join-chat",
    CLOSE_CHAT: "operator:close_chat",
  },
};
