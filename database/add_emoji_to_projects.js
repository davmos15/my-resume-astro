const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

// Add emoji column to projects table
db.serialize(() => {
    db.run(`ALTER TABLE projects ADD COLUMN emoji TEXT DEFAULT '🚀'`, (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                } else {
            }
        } else {
        }
    });

    // Update existing projects with default emojis
    const projectEmojis = {
        'NetSuite': '💼',
        'Onboarding & Offboarding': '🔄',
        'IT Management': '🖥️'
    };

    Object.entries(projectEmojis).forEach(([title, emoji]) => {
        db.run(`UPDATE projects SET emoji = ? WHERE title = ?`, [emoji, title], (err) => {
            if (err) {
            } else {
            }
        });
    });

    // Close the database connection after all operations
    setTimeout(() => {
        db.close((err) => {
            if (err) {
            } else {
            }
        });
    }, 1000);
});