const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database(path.join(__dirname, 'portfolio.db'));

// Create tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Pages content table
    db.run(`CREATE TABLE IF NOT EXISTS page_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        page_name TEXT NOT NULL,
        section_name TEXT NOT NULL,
        content TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(page_name, section_name)
    )`);

    // Projects table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        technologies TEXT,
        github_link TEXT,
        live_link TEXT,
        image_path TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Resume sections table
    db.run(`CREATE TABLE IF NOT EXISTS resume_sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_type TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT,
        date_range TEXT,
        description TEXT,
        details TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Files table for uploaded content
    db.run(`CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        mime_type TEXT,
        size INTEGER,
        path TEXT NOT NULL,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Settings table
    db.run(`CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default admin user (password: admin123)
    const defaultPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, 
        ['admin', defaultPassword]);

    // Insert default page content
    const defaultContent = [
        ['home', 'hero_title', "Hi, I'm Nadav!"],
        ['home', 'hero_subtitle', "I'm an Application Administrator currently working at Foxit Software."],
        ['about', 'bio', "I'm Nadav Moskow, I work in IT Operations and am currently working on migrating our support team from Zendesk to Salesforce Service cloud. If you want to learn more about my experience and other projects I've worked on you can click through to see my resume."],
        ['about', 'hobbies', "In my spare time, I love playing cricket, running (come find me at the next marathon), watching movies or sports or analysing some obscure stats (especially if they relate to movies, running or sport)."],
        ['about', 'tagline', "I'm always up for a chat (or a run)!"],
        ['about', 'quote', "\"I'm the type of person that if you ask me a question and I don't know the answer, I'm gonna tell you that I don't know. But I bet you what, I know how to find the answer and I will find the answer.\""],
        ['about', 'quote_author', "Chris Gardner - Pursuit of Happyness"],
        ['contact', 'email', 'moskownadav@gmail.com'],
        ['contact', 'phone', 'Your phone number'],
        ['contact', 'location', 'Your location']
    ];

    defaultContent.forEach(([page, section, content]) => {
        db.run(`INSERT OR IGNORE INTO page_content (page_name, section_name, content) 
                VALUES (?, ?, ?)`, [page, section, content]);
    });

    // Insert default projects
    const defaultProjects = [
        {
            title: 'NetSuite',
            description: "I supported a major migration project from custom systems to NetSuite ERP. I assisted with importing and transforming customer data as well as extensive testing. Currently, I'm leading as the key admin, working on adjusting user roles and permissions. I also have helped the finance team with processing sales orders and invoices.",
            technologies: 'NetSuite, Data Migration, ERP',
            display_order: 1
        },
        {
            title: 'Onboarding & Offboarding',
            description: "Both the onboarding and offboarding processes were almost nonexistent so I spent a lot of my time implementing a new and improved system. Both processes utilise automation through Power Automate and integrate with Microsoft Form, Freshdesk, Email and Teams.",
            technologies: 'Power Automate, Microsoft Forms, Freshdesk, Teams',
            display_order: 2
        },
        {
            title: 'IT Management',
            description: "More info to come",
            technologies: 'Various',
            display_order: 3
        }
    ];

    defaultProjects.forEach((project) => {
        db.run(`INSERT OR IGNORE INTO projects (title, description, technologies, display_order) 
                VALUES (?, ?, ?, ?)`, 
                [project.title, project.description, project.technologies, project.display_order]);
    });

    // Insert default resume sections
    const defaultResume = [
        {
            section_type: 'experience',
            title: 'Application Administrator',
            subtitle: 'Foxit Software Inc.',
            date_range: 'October 2022 – Current',
            description: '<ul><li>Responsibilities<ul><li>Reporting to the CIO and working closely on a range of projects.</li><li>Manage and maintain key business applications like Oracle NetSuite, Freshdesk, KnowBe4, Bitwarden, and M365, ensuring optimal performance, security, and user accessibility.</li><li>Design, implement, and optimise business system workflows and processes, working in close collaboration with stakeholders for continuous improvement.</li><li>Manage system enhancement projects, ensuring their timely and cost-effective completion in alignment with business goals.</li><li>Document system updates and processes, develop user manuals, and improve the Knowledge Base by creating and updating articles.</li><li>Foster cross-functional collaboration with IT and operations departments, ensuring business systems alignment and resolving issues.</li><li>Provide technical support to users.</li><li>Data Cleanup and optimisation</li></ul></li><li>Major Achievements<ul><li>Brought control of external software under IT, Asana, Zoom</li><li>Played a major role in two migration projects, Netsuite and Zendesk to Salesforce Service Cloud</li><li>Used Miro to document all current processes and possible improvements</li><li>Created multiple PowerApps:<ul><li>For new employees on day one at the company</li><li>Organisation chart with the ability to search and view individual users</li></ul></li><li>Ran interviews & selection processes for multiple IT/IS roles</li></ul></li></ul>',
            display_order: 1
        },
        {
            section_type: 'experience',
            title: 'GBITS-Sec Program Manager',
            subtitle: 'Foxit Software Inc.',
            date_range: 'June 2021 – September 2022',
            description: '<ul><li>Responsibilities<ul><li>Reporting to the CIO</li><li>Process automation and improvement through the use of Power Automation<ul><li>Global onboarding, offboarding & external data data deletion requests</li></ul></li><li>Privacy Inbox (data deletion) request monitoring & actioning</li><li>Managing the internal IT helpdesk (Freshdesk) and knowledge base including writing articles, creating videos, assigning tickets and generally staying on top of things and improving usage</li><li>Training in & starting to role out Microsoft Endpoint (Intune) with the goal of being the global endpoint team lead</li><li>Writing and publishing global policies</li></ul></li><li>Major Achievements<ul><li>Utilisied Power Automate & Freshdesk (amongst other tools) to automate multiple processes including both onboarding & offboarding for all new staff</li><li>Created the companies first proper org chart, utilising Visio and data from Azure AD</li></ul></li></ul>',
            display_order: 2
        },
        {
            section_type: 'experience',
            title: 'Digital Marketing Manager (SEM & Data Analytics)',
            subtitle: 'Digital Autopilot',
            date_range: 'July 2019 – May 2021',
            description: '<ul><li>Responsibilities<ul><li>Taking new clients through onboarding and then onto campaign creation</li><li>Managing clients\' Google accounts & implementing new techniques to improve results for client accounts</li><li>Engaging with clients, running meetings and presenting to clients</li><li>Creating, designing and analysing client reports, mostly using Google Data Studio, however, we also utilised PowerBI, AgencyAnalytics as well as others</li><li>Directly managed one staff member & indirectly another to assist them with their daily Google Ads tasks & SEO tasks respectively</li></ul></li><li>Major Achievements<ul><li>Increased a repairs business from roughly 30 leads a month to over 200 using a suburb based ads strategy</li><li>Doubled a beauty & wellness spas\' leads & Revenue - <a href="https://www.youtube.com/watch?v=JYWm-9sUi_U" target="_blank">watch here</a></li></ul></li></ul>',
            display_order: 3
        },
        {
            section_type: 'skills',
            title: 'Technical Skills',
            description: '<ul><li>Business Applications: NetSuite, Salesforce, Freshdesk, KnowBe4, Bitwarden</li><li>Microsoft 365: Power Automate, PowerApps, SharePoint, Teams, Intune</li><li>Data Analysis: Google Data Studio, PowerBI, AgencyAnalytics</li><li>Marketing: Google Ads, SEO, SEM</li><li>Programming: HTML, CSS, JavaScript, SQL</li></ul>',
            display_order: 1
        },
        {
            section_type: 'education',
            title: 'Bachelor of Commerce',
            subtitle: 'University Name',
            date_range: '2015 - 2018',
            description: 'Major in Information Systems and Marketing',
            display_order: 1
        }
    ];

    defaultResume.forEach((section) => {
        db.run(`INSERT OR IGNORE INTO resume_sections (section_type, title, subtitle, date_range, description, display_order) 
                VALUES (?, ?, ?, ?, ?, ?)`, 
                [section.section_type, section.title, section.subtitle, section.date_range, section.description, section.display_order]);
    });

});

db.close();

module.exports = db;