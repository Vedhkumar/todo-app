import { useState } from 'react';
import { createTodo } from '../api';

interface Props {
  onAdded: () => void;
}

export default function AddTodo({ onAdded }: Props) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await createTodo(trimmed);
      setTitle('');
      onAdded();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        className="add-todo-input"
        type="text"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <button className="add-todo-btn" type="submit" disabled={loading || !title.trim()}>
        {loading ? '…' : 'Add'}
      </button>
    </form>
  );
}
