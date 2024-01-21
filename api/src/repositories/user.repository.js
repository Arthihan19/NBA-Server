const bcrypt = require('bcrypt');
const db = require('../config/db.config');

/**
 * @typedef {Object} UserRow
 * @property {number} userid
 * @property {string} username
 * @property {string} password
 * @property {string} salt
 * @property {number} currency
 * @property {number} bets_won
 * @property {number} bets_lost
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
        salt: row.salt,
        currency: row.currency,
        betsWon: row.bets_won,
        betsLost: row.bets_lost,
        created: row.created
    };
}

class UserRepository {

    async saveRefreshToken(userId, refreshToken) {
        try {
            await db.query('UPDATE users SET refresh_token = $1 WHERE userId = $2', [refreshToken, userId]);
        } catch (error) {
            throw new Error('Error saving refresh token: ' + error.message);
        }
    }

    async findByRefreshToken(refreshToken) {
        try {
            const result = await db.query('SELECT * FROM users WHERE refresh_token = $1', [refreshToken]);
            return result.rows.length ? mapRowToUser(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error fetching user by refresh token: ' + error.message);
        }
    }

    async createUser({username, password}) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const result = await db.query(
                'INSERT INTO users (username, password, salt) VALUES ($1, $2, $3) RETURNING *',
                [username, hashedPassword, salt]
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

    async findById(userId) {
        try {
            const result = await db.query('SELECT * FROM users WHERE userId = $1', [userId]);
            return result.rows && result.rows.length ? mapRowToUser(result.rows[0]) : null;
        } catch (error) {
            throw new Error('Error fetching user by id: ' + error.message);
        }
    }

    async updateCurrency(userId, currency) {
        try {
            await db.query('UPDATE users SET currency = $1 WHERE userId = $2', [currency, userId]);
        } catch (error) {
            throw new Error('Error updating user currency: ' + error.message);
        }
    }

    async updateUserAfterBet(userId, winnings, betWon) {
        try {
            const user = await this.findById(userId);
            const currency = Number(user.currency);
            if (betWon) {
                const newCurrency = currency + winnings;
                await db.query('UPDATE users SET currency = $1, bets_won = bets_won + 1 WHERE userId = $2', [newCurrency.toString(), userId]);
            } else {
                const newCurrency = currency - winnings;
                await db.query('UPDATE users SET currency = $1, bets_lost = bets_lost + 1 WHERE userId = $2', [newCurrency.toString(), userId]);
            }
        } catch (error) {
            throw new Error('Error updating user currency: ' + error.message);
        }
    }

    async getLeaderboard({ page = 0, pageSize = 10 }) {
        try {
            const offset = page * pageSize;
            const leaderboardQuery = `
            SELECT username, currency, bets_won, bets_lost,
            RANK() OVER (ORDER BY CAST(currency AS NUMERIC) DESC) as placing
            FROM users
            ORDER BY CAST(currency AS NUMERIC) DESC
            LIMIT $1 OFFSET $2
        `;
            const leaderboardResult = await db.query(leaderboardQuery, [pageSize, offset]);
            return leaderboardResult.rows;
        } catch (error) {
            throw new Error('Error fetching leaderboard: ' + error.message);
        }
    }

    async getUserPlacing(userId) {
        try {
            const placingQuery = `
                SELECT COUNT(*) + 1 as placing
                FROM users
                WHERE currency > (SELECT currency FROM users WHERE userId = $1)
            `;
            const placingResult = await db.query(placingQuery, [userId]);
            return placingResult.rows[0].placing;
        } catch (error) {
            throw new Error('Error fetching user placing: ' + error.message);
        }
    }
}

module.exports = new UserRepository();