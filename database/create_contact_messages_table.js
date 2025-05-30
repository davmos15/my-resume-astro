const { db } = require('./db');

// Create contact_messages table
db.run(`
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT 0
    )
`, (err) => {
    if (err) {
        console.error('Error creating contact_messages table:', err);
    } else {
        console.log('Contact messages table created successfully');
    }
    db.close();
});