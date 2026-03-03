import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import * as api from "../api";

vi.mock("../api");

const mockTodos: api.Todo[] = [
  { id: 1, title: "Test todo 1", completed: false, created_at: "2026-01-01" },
  { id: 2, title: "Test todo 2", completed: true, created_at: "2026-01-02" },
];

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the app title", async () => {
    vi.mocked(api.getTodos).mockResolvedValue([]);
    render(<App />);
    expect(screen.getByText("✅ Todo App")).toBeInTheDocument();
  });

  it("displays todos from the API", async () => {
    vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Test todo 1")).toBeInTheDocument();
      expect(screen.getByText("Test todo 2")).toBeInTheDocument();
    });
  });

  it("shows remaining count", async () => {
    vi.mocked(api.getTodos).mockResolvedValue(mockTodos);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("1 of 2 remaining")).toBeInTheDocument();
    });
  });

  it("shows error message when API fails", async () => {
    vi.mocked(api.getTodos).mockRejectedValue(new Error("Network error"));
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Could not connect to the server. Is the backend running?",
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows empty state when no todos", async () => {
    vi.mocked(api.getTodos).mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("No todos yet — add one above! 🎉"),
      ).toBeInTheDocument();
    });
  });
});
