import Database from "../config/database.js";
import User from "../models/user.js";

class UserDao {
    async create(user) {
        const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        return new Promise((resolve, reject) => {
            Database.getDb().run(sql, [user.username, user.email, user.password], function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    console.log("Resolved");
                    resolve(this.lastID);
                }
            });
        });
    }

    async findById(id) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        return new Promise((resolve, reject) => {
            Database.getDb().get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async findUserByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        return new Promise((resolve, reject) => {
            Database.getDb().get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

    }

    async findUserByUsername(username) {
        const sql = `SELECT * FROM users WHERE username = ?`;
        return new Promise((resolve, reject) => {
            Database.getDb().get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

export default new UserDao();
