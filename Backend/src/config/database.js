import sqlite3 from 'sqlite3';

class Database {
    constructor() {
        this.db = new sqlite3.Database('./w1866971_cw1.sqlite', (err) => {
            if (err) {
                console.error('Database connection error:', err);
            } else {
                console.log('Connected to SQLite database');
                this.initializeDatabase();
            }
        });
    }

    initializeDatabase() {
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                username TEXT UNIQUE NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`;

        const createSessionsTable = `
            CREATE TABLE IF NOT EXISTS sessions (
                api_key TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                created_at DATETIME NOT NULL,
                expires_at DATETIME NOT NULL,
                is_active BOOLEAN NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )`;

        
        this.db.serialize(() => {
            this.db.run(createUsersTable);
            this.db.run(createSessionsTable);
            console.log("DB connected")
        });
    }

    getDb() {
        return this.db;
    }
}
export default new Database;