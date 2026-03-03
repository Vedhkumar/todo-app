import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import request from "supertest";
import express from "express";

// Mock the database pool
jest.unstable_mockModule("../db.js", () => ({
  default: {
    query: jest.fn(),
  },
}));

const { default: pool } = await import("../db.js");
const { default: todosRouter } = await import("../routes/todos.js");

// Create test app
const app = express();
app.use(express.json());
app.use("/api/todos", todosRouter);

describe("Todos API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/todos", () => {
    it("should return all todos", async () => {
      const mockTodos = [
        {
          id: 1,
          title: "Test todo 1",
          completed: false,
          created_at: "2026-03-02T00:00:00.000Z",
        },
        {
          id: 2,
          title: "Test todo 2",
          completed: true,
          created_at: "2026-03-02T00:00:00.000Z",
        },
      ];

      pool.query.mockResolvedValue({ rows: mockTodos });

      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: 1,
        title: "Test todo 1",
        completed: false,
      });
      expect(response.body[1]).toMatchObject({
        id: 2,
        title: "Test todo 2",
        completed: true,
      });
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM todos ORDER BY created_at DESC",
      );
    });

    it("should return 500 on database error", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to fetch todos" });
    });
  });

  describe("POST /api/todos", () => {
    it("should create a new todo", async () => {
      const newTodo = {
        id: 1,
        title: "New todo",
        completed: false,
        created_at: "2026-03-02T00:00:00.000Z",
      };

      pool.query.mockResolvedValue({ rows: [newTodo] });

      const response = await request(app)
        .post("/api/todos")
        .send({ title: "New todo" });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: 1,
        title: "New todo",
        completed: false,
      });
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO todos (title) VALUES ($1) RETURNING *",
        ["New todo"],
      );
    });

    it("should trim whitespace from title", async () => {
      const newTodo = { id: 1, title: "Trimmed todo", completed: false };

      pool.query.mockResolvedValue({ rows: [newTodo] });

      const response = await request(app)
        .post("/api/todos")
        .send({ title: "  Trimmed todo  " });

      expect(response.status).toBe(201);
      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO todos (title) VALUES ($1) RETURNING *",
        ["Trimmed todo"],
      );
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(app).post("/api/todos").send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Title is required" });
    });

    it("should return 400 if title is empty", async () => {
      const response = await request(app)
        .post("/api/todos")
        .send({ title: "" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Title is required" });
    });

    it("should return 400 if title is only whitespace", async () => {
      const response = await request(app)
        .post("/api/todos")
        .send({ title: "   " });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Title is required" });
    });

    it("should return 500 on database error", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/api/todos")
        .send({ title: "New todo" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to create todo" });
    });
  });

  describe("PUT /api/todos/:id", () => {
    it("should update todo title", async () => {
      const updatedTodo = { id: 1, title: "Updated title", completed: false };

      pool.query.mockResolvedValue({ rows: [updatedTodo] });

      const response = await request(app)
        .put("/api/todos/1")
        .send({ title: "Updated title" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTodo);
    });

    it("should update todo completed status", async () => {
      const updatedTodo = { id: 1, title: "Test todo", completed: true };

      pool.query.mockResolvedValue({ rows: [updatedTodo] });

      const response = await request(app)
        .put("/api/todos/1")
        .send({ completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTodo);
    });

    it("should update both title and completed", async () => {
      const updatedTodo = { id: 1, title: "New title", completed: true };

      pool.query.mockResolvedValue({ rows: [updatedTodo] });

      const response = await request(app)
        .put("/api/todos/1")
        .send({ title: "New title", completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTodo);
    });

    it("should return 404 if todo not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put("/api/todos/999")
        .send({ title: "Updated title" });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Not found" });
    });

    it("should return 500 on database error", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .put("/api/todos/1")
        .send({ title: "Updated title" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to update todo" });
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should delete a todo", async () => {
      const deletedTodo = { id: 1, title: "Deleted todo", completed: false };

      pool.query.mockResolvedValue({ rows: [deletedTodo] });

      const response = await request(app).delete("/api/todos/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Deleted", todo: deletedTodo });
      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM todos WHERE id = $1 RETURNING *",
        ["1"],
      );
    });

    it("should return 404 if todo not found", async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete("/api/todos/999");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "Not found" });
    });

    it("should return 500 on database error", async () => {
      pool.query.mockRejectedValue(new Error("Database error"));

      const response = await request(app).delete("/api/todos/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Failed to delete todo" });
    });
  });
});
