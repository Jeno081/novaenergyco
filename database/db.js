const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de connexion et création des tables
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion à MySQL:', err.message);
        return;
    }
    console.log('Connecté à la base de données MySQL.');

    const createContactsTable = `
        CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            telephone VARCHAR(50),
            service VARCHAR(255),
            message TEXT,
            date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    const createBrochureTable = `
        CREATE TABLE IF NOT EXISTS brochure_leads (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            date_telechargement TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    connection.query(createContactsTable, (err) => {
        if (err) console.error('Erreur création table contacts:', err.message);
    });
    connection.query(createBrochureTable, (err) => {
        if (err) console.error('Erreur création table brochure_leads:', err.message);
    });

    connection.release();
});

module.exports = pool;