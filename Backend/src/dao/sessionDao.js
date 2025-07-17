import Database from './../config/database.js';
import {v4 as uuidv4} from "uuid";
class SessionDao {
    constructor() {
        this.db = Database.getDb();
    }

    async create(userId, createdAt, expiresAt) {
        return new Promise((resolve, reject) => {
            // Generate a secure API key
            const apiKey = uuidv4();

            // Revoke existing active keys for the user (enforce one active key)
            this.db.run(
                `UPDATE sessions SET is_active = 0 WHERE user_id = ? AND is_active = 1`,
                [userId],
                (err) => {
                    if (err) {
                        return reject(err);
                    }

                    // Insert new API key
                    this.db.run(
                        `INSERT INTO sessions (api_key, user_id, created_at, expires_at, is_active) VALUES (?, ?, ?, ?, 1)`,
                        [apiKey, userId, createdAt, expiresAt],
                        function (err) {
                            if (err) {
                                return reject(err);
                            }
                            resolve(apiKey);
                        }
                    );
                }
            );
        });
    }

    async delete(apiKey) {
        return new Promise((resolve, reject) => {
            this.db.run(
                `DELETE FROM sessions WHERE api_key = ? AND is_active = 0`,
                [apiKey],
                function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                }
            );
        });
    }

    async getActiveApiKey(userId) {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT * FROM sessions WHERE user_id = ? AND is_active = 1 AND expires_at > datetime('now')`,
                [userId],
                (err, row) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(row || null);
                }
            );
        });
    }

    async getApiKeyByUserId(userId, apiKey) {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT * FROM sessions WHERE user_id = ? AND api_key = ?`,
                [userId, apiKey],
                (err, row) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(row || null);
                }
            );
        });
    }

    async getApiKeysByUserId(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT * FROM sessions WHERE user_id = ?`,
                [userId],
                (err, row) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(row || null);
                }
            );
        });
    }
}

export default new SessionDao();