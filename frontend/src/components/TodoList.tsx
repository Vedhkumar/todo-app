import { type Todo } from '../api';
import TodoItem from './TodoItem';

interface Props {
  todos: Todo[];
  onChange: () => void;
}

export default function TodoList({ todos, onChange }: Props) {
  if (todos.length === 0) {
    return <p className="empty-state">No todos yet — add one above! 🎉</p>;
  }
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onChange={onChange} />
      ))}
    </ul>
  );
}
