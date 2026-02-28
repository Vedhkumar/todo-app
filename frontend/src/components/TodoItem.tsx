import { useState } from 'react';
import { type Todo, updateTodo, deleteTodo } from '../api';

interface Props {
  todo: Todo;
  onChange: () => void;
}

export default function TodoItem({ todo, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      await updateTodo(todo.id, { completed: !todo.completed });
      onChange();
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    const trimmed = editTitle.trim();
    if (!trimmed) { setEditing(false); setEditTitle(todo.title); return; }
    setLoading(true);
    try {
      await updateTodo(todo.id, { title: trimmed });
      setEditing(false);
      onChange();
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    setLoading(true);
    try {
      await deleteTodo(todo.id);
      onChange();
    } finally {
      setLoading(false);
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} ${loading ? 'loading' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={toggle}
        disabled={loading}
      />

      {editing ? (
        <input
          className="todo-edit-input"
          value={editTitle}
          autoFocus
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setEditing(false); setEditTitle(todo.title); } }}
          disabled={loading}
        />
      ) : (
        <span
          className="todo-title"
          onDoubleClick={() => { if (!todo.completed) { setEditing(true); setEditTitle(todo.title); } }}
          title={todo.completed ? '' : 'Double-click to edit'}
        >
          {todo.title}
        </span>
      )}

      <button
        className="todo-delete-btn"
        onClick={remove}
        disabled={loading}
        aria-label="Delete todo"
      >
        ✕
      </button>
    </li>
  );
}
