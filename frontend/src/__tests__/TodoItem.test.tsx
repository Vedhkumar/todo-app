import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoItem from "../components/TodoItem";
import * as api from "../api";

vi.mock("../api");

const mockTodo: api.Todo = {
  id: 1,
  title: "Test todo",
  completed: false,
  created_at: "2026-01-01",
};

const completedTodo: api.Todo = {
  id: 2,
  title: "Completed todo",
  completed: true,
  created_at: "2026-01-01",
};

describe("TodoItem", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders todo title", () => {
    render(<TodoItem todo={mockTodo} onChange={mockOnChange} />);
    expect(screen.getByText("Test todo")).toBeInTheDocument();
  });

  it("renders checkbox unchecked for incomplete todo", () => {
    render(<TodoItem todo={mockTodo} onChange={mockOnChange} />);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("renders checkbox checked for completed todo", () => {
    render(<TodoItem todo={completedTodo} onChange={mockOnChange} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });

  it("toggles completion when checkbox is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(api.updateTodo).mockResolvedValue({
      ...mockTodo,
      completed: true,
    });

    render(<TodoItem todo={mockTodo} onChange={mockOnChange} />);
    await user.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(api.updateTodo).toHaveBeenCalledWith(1, { completed: true });
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it("deletes todo when delete button is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(api.deleteTodo).mockResolvedValue({});

    render(<TodoItem todo={mockTodo} onChange={mockOnChange} />);
    await user.click(screen.getByRole("button", { name: "Delete todo" }));

    await waitFor(() => {
      expect(api.deleteTodo).toHaveBeenCalledWith(1);
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it("enters edit mode on double click", async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={mockTodo} onChange={mockOnChange} />);

    await user.dblClick(screen.getByText("Test todo"));

    expect(screen.getByDisplayValue("Test todo")).toBeInTheDocument();
  });

  it("saves edit on blur", async () => {
    const user = userEvent.setup();
    vi.mocked(api.updateTodo).mockResolvedValue({
      ...mockTodo,
      title: "Updated todo",
    });

    render(<TodoItem todo={mockTodo} onChange={mockOnChange} />);

    await user.dblClick(screen.getByText("Test todo"));
    const input = screen.getByDisplayValue("Test todo");
    await user.clear(input);
    await user.type(input, "Updated todo");
    fireEvent.blur(input);

    await waitFor(() => {
      expect(api.updateTodo).toHaveBeenCalledWith(1, { title: "Updated todo" });
    });
  });

  it("does not allow editing completed todos", async () => {
    const user = userEvent.setup();
    render(<TodoItem todo={completedTodo} onChange={mockOnChange} />);

    await user.dblClick(screen.getByText("Completed todo"));

    // Should still show span, not input
    expect(
      screen.queryByDisplayValue("Completed todo"),
    ).not.toBeInTheDocument();
  });
});

// Need to import fireEvent for blur
import { fireEvent } from "@testing-library/react";
