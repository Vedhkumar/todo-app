import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodo from "../components/AddTodo";
import * as api from "../api";

vi.mock("../api");

describe("AddTodo", () => {
  const mockOnAdded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders input and button", () => {
    render(<AddTodo onAdded={mockOnAdded} />);
    expect(
      screen.getByPlaceholderText("What needs to be done?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("button is disabled when input is empty", () => {
    render(<AddTodo onAdded={mockOnAdded} />);
    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });

  it("button is enabled when input has text", async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdded={mockOnAdded} />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "New todo",
    );
    expect(screen.getByRole("button", { name: "Add" })).toBeEnabled();
  });

  it("calls createTodo and onAdded when form is submitted", async () => {
    const user = userEvent.setup();
    vi.mocked(api.createTodo).mockResolvedValue({
      id: 1,
      title: "New todo",
      completed: false,
      created_at: "2026-01-01",
    });

    render(<AddTodo onAdded={mockOnAdded} />);

    await user.type(
      screen.getByPlaceholderText("What needs to be done?"),
      "New todo",
    );
    await user.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(api.createTodo).toHaveBeenCalledWith("New todo");
      expect(mockOnAdded).toHaveBeenCalled();
    });
  });

  it("clears input after successful submission", async () => {
    const user = userEvent.setup();
    vi.mocked(api.createTodo).mockResolvedValue({
      id: 1,
      title: "New todo",
      completed: false,
      created_at: "2026-01-01",
    });

    render(<AddTodo onAdded={mockOnAdded} />);
    const input = screen.getByPlaceholderText("What needs to be done?");

    await user.type(input, "New todo");
    await user.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });

  it("does not submit when input is only whitespace", async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdded={mockOnAdded} />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    await user.type(input, "   ");

    expect(screen.getByRole("button", { name: "Add" })).toBeDisabled();
  });
});
