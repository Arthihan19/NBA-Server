const APIError = require('../errors/api.error');
const ITodoService = require('../interfaces/ITodoService');

class TodoService extends ITodoService {
    constructor(todoRepository) {
        super();
        this.todoRepository = todoRepository;
    }

    async getAllTodos(userId) {
        return await this.todoRepository.findAll(userId);
    }

    async getTodoById(id, userId) {
        const todo = await this.todoRepository.findById(id, userId);
        if (!todo) {
            throw new APIError(404, 'Todo not found');
        }
        return todo;
    }

    async createTodo(todoData, userId) {
        return this.todoRepository.create(todoData, userId);
    }

    async updateTodo(id, todoData, userId) {
        const existingTodo = await this.getTodoById(id, userId);
        if (!existingTodo) {
            throw new APIError(404, 'Todo not found');
        }
        return this.todoRepository.update(id, todoData, userId);
    }

    async deleteTodo(id, userId) {
        const todo = await this.getTodoById(id, userId);
        if (!todo) {
            throw new APIError(404, 'Todo not found');
        }
        return this.todoRepository.delete(id, userId);
    }
}

module.exports = TodoService;