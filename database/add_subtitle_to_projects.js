const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

db.serialize(() => {
    // Add subtitle column to projects table
    db.run(`ALTER TABLE projects ADD COLUMN subtitle TEXT`, (err) => {
        if (err) {
        } else {
        }
    });
});

db.close((err) => {
    if (err) {
    } else {
    }
});