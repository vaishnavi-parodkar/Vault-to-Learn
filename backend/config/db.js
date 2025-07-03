const sqlite3 = require("sqlite3").verbose();
const path    = require("path");

// Resolve the path to your database file
const dbPath = path.resolve(__dirname, "../database.sqlite");

// Open (or create) the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("❌ SQLite Error:", err.message);
    else     console.log("✅ SQLite connected at", dbPath);
});


db.serialize(() => {

    db.run("PRAGMA foreign_keys = ON;");


    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'passenger',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

module.exports = db;
