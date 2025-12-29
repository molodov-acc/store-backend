import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import './Chat.css';

/**
 * Компонент чата для клиента
 * @param {string} userId - ID пользователя
 */
export function ClientChat({ userId }) {
  const { socket, isConnected, chatId, SOCKET_EVENTS } = useSocket(userId, 'client');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Прокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Подписываемся на события
  useEffect(() => {
    if (!socket) return;

    // Получение новых сообщений
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    // Индикатор набора текста
    const handleTypingStart = (data) => {
      if (data.role === 'operator') {
        setIsTyping(true);
      }
    };

    const handleTypingStop = (data) => {
      if (data.role === 'operator') {
        setIsTyping(false);
      }
    };

    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.NEW, handleNewMessage);
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_START, handleTypingStart);
    socket.on(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_STOP, handleTypingStop);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE.NEW, handleNewMessage);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_START, handleTypingStart);
      socket.off(SOCKET_EVENTS.CHAT.MESSAGE.TYPING_STOP, handleTypingStop);
    };
  }, [socket, SOCKET_EVENTS]);

  // Отправка сообщения
  const sendMessage = () => {
    if (!socket || !chatId || !inputText.trim()) return;

    socket.emit(SOCKET_EVENTS.CHAT.MESSAGE.SEND, {
      chatId,
      text: inputText.trim(),
    });

    setInputText('');
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
    if (e.key === 'Enter' && !e.shiftKey) {
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
        <div className={`status-indicator ${isConnected ? 'online' : 'offline'}`}>
          {isConnected ? '●' : '○'}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message message-${message.sender}`}>
            <div className="message-sender">
              {message.sender === 'server'
                ? 'Система'
                : message.sender === 'client'
                ? 'Вы'
                : 'Оператор'}
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

