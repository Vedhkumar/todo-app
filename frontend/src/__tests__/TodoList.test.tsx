import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TodoList from "../components/TodoList";
import type { Todo } from "../api";

vi.mock("../api");

const mockTodos: Todo[] = [
  { id: 1, title: "Todo 1", completed: false, created_at: "2026-01-01" },
  { id: 2, title: "Todo 2", completed: true, created_at: "2026-01-02" },
];

describe("TodoList", () => {
  const mockOnChange = vi.fn();

  it("renders empty state when no todos", () => {
    render(<TodoList todos={[]} onChange={mockOnChange} />);
    expect(
      screen.getByText("No todos yet — add one above! 🎉"),
    ).toBeInTheDocument();
  });

  it("renders list of todos", () => {
    render(<TodoList todos={mockTodos} onChange={mockOnChange} />);

    expect(screen.getByText("Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Todo 2")).toBeInTheDocument();
  });

  it("renders correct number of todo items", () => {
    render(<TodoList todos={mockTodos} onChange={mockOnChange} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
  });
});
