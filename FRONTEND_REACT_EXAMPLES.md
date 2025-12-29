# 🚀 Подключение чата Socket.IO в React

## 📦 Установка зависимостей

```bash
npm install socket.io-client
# или
yarn add socket.io-client
```

## 🔧 1. Создание хука для Socket.IO

Создайте файл `hooks/useSocket.js`:

```javascript
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_EVENTS = {
  CHAT: {
    INIT: "chat:init",
    NEW: "chat:new",
    JOINED: "chat:joined",
    UPDATED: "chat:updated",
    CLOSED: "chat:closed",
    MESSAGE: {
      SEND: "chat:message:send",
      NEW: "chat:message:new",
      TYPING_START: "chat:typing:start",
      TYPING_STOP: "chat:typing:stop",
    },
  },
  OPERATOR: {
    JOIN_CHAT: "operator:join-chat",
  },
};

export function useSocket(userId, role) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chatId, setChatId] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId || !role) return;

    // Подключаемся к серверу
    const newSocket = io("http://localhost:3000", {
      auth: {
        userId,
        role,
      },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket подключен");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket отключен");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Ошибка подключения:", error);
    });

    // Клиент: получаем chatId при инициализации
    if (role === "client") {
      newSocket.on(SOCKET_EVENTS.CHAT.INIT, (data) => {
        setChatId(data.chatId);
        console.log("Чат создан:", data.chatId);
      });
    }

    // Очистка при размонтировании
    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, [userId, role]);

  return {
    socket,
    isConnected,
    chatId,
    SOCKET_EVENTS,
  };
}
```

## 💬 2. Компонент чата для клиента

Создайте файл `components/ClientChat.jsx`:

```javascript
import { useState, useEffect, useRef } from "react";
import { useSocket } from "../hooks/useSocket";

export function ClientChat({ userId }) {
  const { socket, isConnected, chatId, SOCKET_EVENTS } = useSocket(
    userId,
    "client"
  );
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Подписываемся на события
  useEffect(() => {
    if (!socket) return;

    // Получение новых сообщений
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.NEW, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Индикатор набора текста
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_START, (data) => {
      if (data.role === "operator") {
        setIsTyping(true);
      }
    });

    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_STOP, (data) => {
      if (data.role === "operator") {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE.NEW);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_START);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_STOP);
    };
  }, [socket, SOCKET_EVENTS]);

  // Отправка сообщения
  const sendMessage = () => {
    if (!socket || !chatId || !inputText.trim()) return;

    socket.emit(SOCKET_EVENTS.CHAT.MESSAGE.SEND, {
      chatId,
      text: inputText.trim(),
    });

    setInputText("");
    stopTyping();
  };

  // Обработка набора текста
  const handleTyping = () => {
    if (!socket || !chatId) return;

    socket.emit(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_START, { chatId });

    // Останавливаем индикатор через 1 секунду бездействия
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  };

  const stopTyping = () => {
    if (!socket || !chatId) return;
    socket.emit(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_STOP, { chatId });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isConnected) {
    return (
      <div className="chat-container">
        <div className="chat-status">Подключение к серверу...</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Чат поддержки</h3>
        <div
          className={`status-indicator ${isConnected ? "online" : "offline"}`}
        >
          {isConnected ? "●" : "○"}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message message-${message.sender}`}>
            <div className="message-sender">
              {message.sender === "server"
                ? "Система"
                : message.sender === "client"
                ? "Вы"
                : "Оператор"}
            </div>
            <div className="message-text">{message.text}</div>
            <div className="message-time">
              {new Date(message.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span>Оператор печатает...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          placeholder="Введите сообщение..."
          disabled={!chatId}
        />
        <button onClick={sendMessage} disabled={!chatId || !inputText.trim()}>
          Отправить
        </button>
      </div>
    </div>
  );
}
```

## 👨‍💼 3. Компонент панели оператора

Создайте файл `components/OperatorPanel.jsx`:

```javascript
import { useState, useEffect, useRef } from "react";
import { useSocket } from "../hooks/useSocket";

export function OperatorPanel({ userId }) {
  const { socket, isConnected, SOCKET_EVENTS } = useSocket(userId, "operator");
  const [waitingChats, setWaitingChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // Подписываемся на события оператора
  useEffect(() => {
    if (!socket) return;

    // Новый чат появился
    socket.on(SOCKET_EVENTS.CHAT.NEW, (data) => {
      setWaitingChats((prev) => [...prev, data]);
    });

    // Оператор подключился к чату
    socket.on(SOCKET_EVENTS.CHAT.JOINED, (data) => {
      setWaitingChats((prev) => prev.filter((c) => c.chatId !== data.chatId));
      if (data.operatorId === userId) {
        setActiveChatId(data.chatId);
      }
    });

    // Чат обновлен
    socket.on(SOCKET_EVENTS.CHAT.UPDATED, (data) => {
      setWaitingChats((prev) =>
        prev.map((chat) =>
          chat.chatId === data.chatId ? { ...chat, status: data.status } : chat
        )
      );
    });

    // Чат закрыт
    socket.on(SOCKET_EVENTS.CHAT.CLOSED, (data) => {
      setWaitingChats((prev) => prev.filter((c) => c.chatId !== data.chatId));
      if (activeChatId === data.chatId) {
        setActiveChatId(null);
        setMessages([]);
      }
    });

    // Новое сообщение
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.NEW, (message) => {
      if (message.chatId === activeChatId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off(SOCKET_EVENTS.CHAT.NEW);
      socket.off(SOCKET_EVENTS.CHAT.JOINED);
      socket.off(SOCKET_EVENTS.CHAT.UPDATED);
      socket.off(SOCKET_EVENTS.CHAT.CLOSED);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE.NEW);
    };
  }, [socket, SOCKET_EVENTS, userId, activeChatId]);

  // Прокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Подключение к чату
  const joinChat = (chatId) => {
    if (!socket || activeChatId) return;
    socket.emit(SOCKET_EVENTS.OPERATOR.JOIN_CHAT, { chatId });
    setActiveChatId(chatId);
    setMessages([]);
  };

  // Закрытие чата
  const closeChat = () => {
    if (!socket || !activeChatId) return;
    socket.emit(SOCKET_EVENTS.CHAT.CLOSE, { chatId: activeChatId });
    setActiveChatId(null);
    setMessages([]);
  };

  // Отправка сообщения
  const sendMessage = () => {
    if (!socket || !activeChatId || !inputText.trim()) return;

    socket.emit(SOCKET_EVENTS.CHAT.MESSAGE.SEND, {
      chatId: activeChatId,
      text: inputText.trim(),
    });

    setInputText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isConnected) {
    return <div>Подключение к серверу...</div>;
  }

  return (
    <div className="operator-panel">
      <div className="operator-header">
        <h2>Панель оператора</h2>
        <div className={`status ${isConnected ? "online" : "offline"}`}>
          {isConnected ? "Онлайн" : "Офлайн"}
        </div>
      </div>

      <div className="operator-content">
        {/* Список ожидающих чатов */}
        <div className="waiting-chats">
          <h3>Ожидающие чаты ({waitingChats.length})</h3>
          {waitingChats.length === 0 ? (
            <p>Нет ожидающих чатов</p>
          ) : (
            <div className="chats-list">
              {waitingChats.map((chat) => (
                <div key={chat.chatId} className="chat-item">
                  <div>
                    <strong>Чат:</strong> {chat.chatId}
                    <br />
                    <small>Клиент: {chat.clientId}</small>
                    <br />
                    <span className={`status-badge status-${chat.status}`}>
                      {chat.status}
                    </span>
                  </div>
                  <button
                    onClick={() => joinChat(chat.chatId)}
                    disabled={!!activeChatId}
                  >
                    Подключиться
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Активный чат */}
        {activeChatId && (
          <div className="active-chat">
            <div className="chat-header">
              <h3>Чат: {activeChatId}</h3>
              <button onClick={closeChat}>Закрыть чат</button>
            </div>

            <div className="messages-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message message-${message.sender}`}
                >
                  <div className="message-sender">
                    {message.sender === "server"
                      ? "Система"
                      : message.sender === "operator"
                      ? "Вы"
                      : "Клиент"}
                  </div>
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-container">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите сообщение..."
              />
              <button onClick={sendMessage} disabled={!inputText.trim()}>
                Отправить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 🎨 4. Базовые стили (CSS)

Создайте файл `styles/chat.css`:

```css
/* Контейнер чата */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-width: 500px;
  margin: 0 auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #4caf50;
  color: white;
}

.status-indicator {
  font-size: 12px;
}

.status-indicator.online {
  color: #4caf50;
}

.status-indicator.offline {
  color: #ccc;
}

/* Сообщения */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  background: #f9f9f9;
}

.message {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
}

.message-server {
  background: #e3f2fd;
  margin: 0 auto;
  text-align: center;
  max-width: 90%;
  font-style: italic;
  color: #666;
}

.message-client {
  background: #e8f5e9;
  margin-left: auto;
  text-align: right;
}

.message-operator {
  background: #fff3e0;
  margin-right: auto;
}

.message-sender {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 5px;
  color: #666;
}

.message-text {
  word-wrap: break-word;
}

.message-time {
  font-size: 10px;
  color: #999;
  margin-top: 5px;
}

.typing-indicator {
  padding: 10px;
  font-style: italic;
  color: #999;
}

/* Ввод */
.input-container {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #ddd;
}

.input-container input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-container button {
  padding: 10px 20px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-container button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Панель оператора */
.operator-panel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.operator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.operator-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.waiting-chats {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: white;
}

.chats-list {
  margin-top: 10px;
}

.chat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: #f9f9f9;
  border-radius: 4px;
}

.chat-item button {
  padding: 5px 15px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.chat-item button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-top: 5px;
}

.status-waiting {
  background: #fff3cd;
  color: #856404;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-closed {
  background: #f8d7da;
  color: #721c24;
}

.active-chat {
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 600px;
  background: white;
}

.active-chat .chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #ddd;
}

.active-chat .chat-header button {
  padding: 5px 15px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
```

## 📱 5. Использование в приложении

```javascript
// App.jsx
import { useState } from "react";
import { ClientChat } from "./components/ClientChat";
import { OperatorPanel } from "./components/OperatorPanel";
import "./styles/chat.css";

function App() {
  const [userId] = useState("user123"); // Получайте из контекста/состояния
  const [isOperator] = useState(false); // Проверяйте роль пользователя

  return (
    <div className="App">
      {isOperator ? (
        <OperatorPanel userId={userId} />
      ) : (
        <ClientChat userId={userId} />
      )}
    </div>
  );
}

export default App;
```

## 🔐 6. Интеграция с аутентификацией

Если у вас есть JWT токены:

```javascript
// hooks/useSocket.js (улучшенная версия)
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export function useSocket(userId, role, token) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId || !role) return;

    const newSocket = io("http://localhost:3000", {
      auth: {
        userId,
        role,
        token, // JWT токен если используется
      },
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Ошибка подключения:", error);
      // Можно показать уведомление пользователю
    });

    return () => {
      newSocket.close();
    };
  }, [userId, role, token]);

  return { socket, isConnected };
}
```

## 🎯 Основные моменты:

1. **Подключение**: Используйте `useSocket` хук для управления соединением
2. **События**: Подписывайтесь на события в `useEffect` с правильной очисткой
3. **Состояние**: Храните сообщения и чаты в `useState`
4. **Очистка**: Всегда отписывайтесь от событий при размонтировании
5. **Обработка ошибок**: Добавьте обработку ошибок подключения

## 📝 Дополнительные улучшения:

- Сохранение истории сообщений в localStorage
- Автопереподключение при разрыве связи
- Уведомления о новых сообщениях
- Звуковые сигналы
- Эмодзи и файлы в сообщениях
