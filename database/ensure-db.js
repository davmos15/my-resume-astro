const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dbPath = path.join(__dirname, 'portfolio.db');

// Check if database exists
if (!fs.existsSync(dbPath)) {
    console.log('Database not found. Initializing...');
    
    try {
        // Run initialization script
        execSync('node database/init.js', { stdio: 'inherit' });
        
        // Run migrations
        console.log('Running migrations...');
        execSync('node database/create_contact_messages_table.js', { stdio: 'inherit' });
        execSync('node database/add_subtitle_to_projects.js', { stdio: 'inherit' });
        execSync('node database/add_emoji_to_projects.js', { stdio: 'inherit' });
        
        console.log('Database initialization complete!');
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
} else {
    console.log('Database found at:', dbPath);
}