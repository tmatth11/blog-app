const dbClient = require('../db');

class UserAccountsRepository {
    constructor() {

    }

    async insert(username, password) {
        const sql = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;
        const values = [username, password];
        const result = await dbClient.query(sql, values);
        return result.rows[0];
    }

    async select(username) {
        const sql = `SELECT id, username, password FROM users WHERE username = $1`;
        const values = [username];
        const result = await dbClient.query(sql, values);
        return result.rows[0];
    }
}

module.exports = UserAccountsRepository;