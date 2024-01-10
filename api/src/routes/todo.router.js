const express = require('express');
const todoRouter = express.Router();

const TodoController = require("../controllers/todo.controller");

module.exports = function(todoControllerInstance) {
    // GET all todos
    todoRouter.get("/", todoControllerInstance.getAllTodos);

    // GET a single todo by its ID
    todoRouter.get("/:id", todoControllerInstance.getTodoById);

    // POST (create) a new todo
    todoRouter.post("/", todoControllerInstance.createTodo);

    // PUT (update) a todo by its ID
    todoRouter.put("/:id", todoControllerInstance.updateTodo);

    // DELETE a todo by its ID
    todoRouter.delete("/:id", todoControllerInstance.deleteTodo);

    return todoRouter;
};
