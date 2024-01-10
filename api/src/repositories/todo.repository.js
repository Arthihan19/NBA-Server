const db = require('../config/db.config');
const Todo = require('../models/todo.model');

/**
 * @typedef {Object} TodoRow
 * @property {number} todoid
 * @property {string} todoname
 * @property {string} tododescription
 * @property {boolean} todocomplete
 * @property {Date} todocreated
 * @property {Date} todoupdated
 */

/**
 * Maps a row from the database to a Todo object.
 *
 * @param {TodoRow} row
 */
const mapRowToTodo = (row) => {
    return new Todo({
        todoId: row.todoid,
        todoName: row.todoname,
        todoDescription: row.tododescription,
        todoComplete: row.todocomplete,
        todoCreated: row.todocreated,
        todoUpdated: row.todoupdated,
    });
};

class TodoRepository {
    async findAll(userId) {
        try {
            const result = await db.query('SELECT * FROM todos WHERE userId = $1', [userId]);
            return result.rows.map(mapRowToTodo);
        } catch (error) {
            throw new Error('Error fetching todos: ' + error.message);
        }
    }

    async findById(id, userId) {
        try {
            const result = await db.query('SELECT * FROM todos WHERE todoid = $1 AND userId = $2', [id, userId]);
            return result.rows && result.rows.length ? mapRowToTodo(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error fetching todo by ID: ' + error.message);
        }
    }

    async create(todoData, userId) {
        try {
            const result = await db.query(
                'INSERT INTO todos (todoname, tododescription, userId) VALUES ($1, $2, $3) RETURNING *',
                [todoData.todoName, todoData.todoDescription, userId]
            );
            return mapRowToTodo(result.rows[0]);
        } catch (error) {
            throw new Error('Error creating todo: ' + error.message);
        }
    }

    async update(id, todoData, userId) {
        try {
            const result = await db.query(
                'UPDATE todos SET todoname = $1, tododescription = $2, todocomplete = $3, todoupdated = CURRENT_TIMESTAMP WHERE todoid = $4 AND userId = $5 RETURNING *',
                [todoData.todoName, todoData.todoDescription, todoData.todoComplete, id, userId]
            );
            return result.rows && result.rows.length ? mapRowToTodo(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error updating todo: ' + error.message);
        }
    }

    async delete(id, userId) {
        try {
            const result = await db.query('DELETE FROM todos WHERE todoid = $1 AND userId = $2 RETURNING *', [id, userId]);
            return result.rows && result.rows.length ? mapRowToTodo(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error deleting todo: ' + error.message);
        }
    }
}

module.exports = TodoRepository;
