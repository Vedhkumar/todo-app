import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
}

export const getTodos = () => api.get<Todo[]>('/todos').then((r) => r.data);

export const createTodo = (title: string) =>
  api.post<Todo>('/todos', { title }).then((r) => r.data);

export const updateTodo = (id: number, data: Partial<Pick<Todo, 'title' | 'completed'>>) =>
  api.put<Todo>(`/todos/${id}`, data).then((r) => r.data);

export const deleteTodo = (id: number) =>
  api.delete(`/todos/${id}`).then((r) => r.data);
