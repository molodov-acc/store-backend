import { useState } from 'react';
import { ClientChat } from './components/ClientChat';
import { OperatorPanel } from './components/OperatorPanel';
import './components/Chat.css';

/**
 * Пример использования компонентов чата
 * 
 * В реальном приложении userId и isOperator должны браться из:
 * - Контекста аутентификации
 * - Redux/Zustand store
 * - localStorage
 * - JWT токена
 */
function App() {
  // Пример: получаем userId из localStorage или контекста
  const [userId] = useState(() => {
    // В реальном приложении:
    // return useAuth().user?.id;
    // или
    // return localStorage.getItem('userId');
    return 'user123';
  });

  // Пример: проверяем роль пользователя
  const [isOperator] = useState(() => {
    // В реальном приложении:
    // return useAuth().user?.role === 'operator';
    // или
    // return localStorage.getItem('userRole') === 'operator';
    return false;
  });

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

