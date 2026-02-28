import { useEffect, useState, useCallback } from 'react';
import { getTodos, type Todo } from './api';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    try {
      setError('');
      const data = await getTodos();
      setTodos(data);
    } catch {
      setError('Could not connect to the server. Is the backend running?');
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="page">
      <div className="card">
        <header className="card-header">
          <h1 className="card-title">✅ Todo App</h1>
          {todos.length > 0 && (
            <span className="todo-counter">
              {remaining} of {todos.length} remaining
            </span>
          )}
        </header>

        <AddTodo onAdded={fetchTodos} />

        {error && <p className="error-msg">{error}</p>}

        <TodoList todos={todos} onChange={fetchTodos} />
      </div>
    </div>
  );
}
