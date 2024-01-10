const db = require('../config/db.config');
const IUserRepository = require('../interfaces/IUserRepository');

/**
 * @typedef {Object} UserRow
 * @property {number} userid
 * @property {string} username
 * @property {string} password
 * @property {Date} created
 */

/**
 * Maps a row from the database to a User object.
 *
 * @param {UserRow} row
 */
const mapRowToUser = (row) => {
    return {
        userId: row.userid,
        username: row.username,
        password: row.password,
        created: row.created
    };
}

class UserRepository extends IUserRepository {
    async createUser({ username, password }) {
        try {
            const result = await db.query(
                'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
                [username, password]
            );
            return mapRowToUser(result.rows[0]);
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    async findByUsername(username) {
        try {
            const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
            return result.rows && result.rows.length ? mapRowToUser(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error fetching user by username: ' + error.message);
        }
    }
}

module.exports = UserRepository;