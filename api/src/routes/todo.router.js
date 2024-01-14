const express = require('express');
const todoRouter = express.Router();

const TodoController = require("../controllers/todo.controller");

module.exports = function() {
    // GET all todos
    todoRouter.get("/", TodoController.getAllTodos);

    // GET a single todo by its ID
    todoRouter.get("/:id", TodoController.getTodoById);

    // POST (create) a new todo
    todoRouter.post("/", TodoController.createTodo);

    // PUT (update) a todo by its ID
    todoRouter.put("/:id", TodoController.updateTodo);

    // DELETE a todo by its ID
    todoRouter.delete("/:id", TodoController.deleteTodo);

    return todoRouter;
};
