const TodoInputDTO = require('../dto/todo.create.dto');
const TodoUpdateDTO = require('../dto/todo.update.dto');

const TodoService = require('../services/todo.service');

class TodoController {
    asyncWrapper(fn) {
        return (req, res, next) => {
            fn(req, res, next).catch(next);
        };
    }

    getAllTodos = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const todos = await TodoService.getAllTodos(userId);
        res.status(200).json(todos);
    });

    getTodoById = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const todo = await TodoService.getTodoById(req.params.id, userId);
        res.status(200).json(todo);
    });

    createTodo = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const todoInputDTO = TodoInputDTO.fromRequest(req.body);
        const newTodo = await TodoService.createTodo(todoInputDTO, userId);
        res.status(201).json(newTodo);
    });

    updateTodo = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const todoUpdateDTO = TodoUpdateDTO.fromRequest(req.body);
        const updatedTodo = await TodoService.updateTodo(req.params.id, todoUpdateDTO, userId);
        res.status(200).json(updatedTodo);
    });

    deleteTodo = this.asyncWrapper(async (req, res) => {
        const userId = req.user.id;
        const deletedTodo = await TodoService.deleteTodo(req.params.id, userId);
        res.status(200).json({message: "Todo deleted successfully", deletedTodo});
    });
}

module.exports = new TodoController();
