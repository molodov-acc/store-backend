# 🚀 Быстрый старт с React чатом

## 📋 Шаги установки

### 1. Установите зависимости

```bash
npm install socket.io-client
# или
yarn add socket.io-client
```

### 2. Скопируйте файлы в ваш проект

Скопируйте следующие файлы в ваш React проект:

```
react-examples/
├── hooks/
│   └── useSocket.js          → src/hooks/useSocket.js
├── components/
│   ├── ClientChat.jsx        → src/components/ClientChat.jsx
│   ├── OperatorPanel.jsx     → src/components/OperatorPanel.jsx
│   └── Chat.css              → src/components/Chat.css
```

### 3. Используйте компоненты

```jsx
import { ClientChat } from "./components/ClientChat";
import { OperatorPanel } from "./components/OperatorPanel";

function App() {
  const userId = "user123"; // Получайте из вашей системы аутентификации
  const isOperator = false; // Проверяйте роль пользователя

  return (
    <div>
      {isOperator ? (
        <OperatorPanel userId={userId} />
      ) : (
        <ClientChat userId={userId} />
      )}
    </div>
  );
}
```

## 🔧 Настройка URL сервера

По умолчанию используется `http://localhost:3000`. Чтобы изменить:

```jsx
// В useSocket.js измените параметр serverUrl
const { socket, isConnected, chatId } = useSocket(
  userId,
  "client",
  "https://your-server.com" // Ваш URL
);
```

## 📝 Интеграция с вашей системой аутентификации

### Пример с контекстом:

```jsx
// AuthContext.jsx
import { createContext, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user] = useState({ id: "user123", role: "client" });

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// App.jsx
import { useAuth } from "./AuthContext";
import { ClientChat } from "./components/ClientChat";
import { OperatorPanel } from "./components/OperatorPanel";

function App() {
  const { user } = useAuth();

  return (
    <div>
      {user.role === "operator" ? (
        <OperatorPanel userId={user.id} />
      ) : (
        <ClientChat userId={user.id} />
      )}
    </div>
  );
}
```

## 🎨 Кастомизация стилей

Все стили находятся в `Chat.css`. Вы можете:

- Изменить цвета
- Изменить размеры
- Добавить анимации
- Адаптировать под ваш дизайн

## ✅ Что уже работает:

- ✅ Подключение к серверу
- ✅ Создание чата для клиента
- ✅ Список ожидающих чатов для оператора
- ✅ Подключение оператора к чату
- ✅ Отправка и получение сообщений
- ✅ Индикатор набора текста
- ✅ Автоматическая прокрутка сообщений
- ✅ Обработка отключений

## 🔄 Дальнейшие улучшения:

1. **Сохранение истории** - добавьте localStorage или базу данных
2. **Уведомления** - используйте Web Notifications API
3. **Файлы** - добавьте загрузку изображений через multer
4. **Эмодзи** - добавьте emoji picker
5. **Звуки** - добавьте звуковые уведомления

## 📚 Документация

Полная документация находится в `FRONTEND_REACT_EXAMPLES.md`
