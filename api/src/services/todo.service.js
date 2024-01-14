const APIError = require('../errors/api.error');

const TodoRepository = require('../repositories/todo.repository');

class TodoService {
    async getAllTodos(userId) {
        return await TodoRepository.findAll(userId);
    }

    async getTodoById(id, userId) {
        const todo = await TodoRepository.findById(id, userId);
        if (!todo) {
            throw new APIError(404, 'Todo not found');
        }
        return todo;
    }

    async createTodo(todoData, userId) {
        return TodoRepository.create(todoData, userId);
    }

    async updateTodo(id, todoData, userId) {
        const existingTodo = await this.getTodoById(id, userId);
        if (!existingTodo) {
            throw new APIError(404, 'Todo not found');
        }
        return TodoRepository.update(id, todoData, userId);
    }

    async deleteTodo(id, userId) {
        const todo = await this.getTodoById(id, userId);
        if (!todo) {
            throw new APIError(404, 'Todo not found');
        }
        return TodoRepository.delete(id, userId);
    }
}

module.exports = new TodoService();