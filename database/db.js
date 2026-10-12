const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'novaenergyco.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à la base de données:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
});

db.serialize(() => {
    // Table existante pour les contacts
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        email TEXT NOT NULL,
        telephone TEXT,
        service TEXT,
        message TEXT,
        date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // NOUVELLE TABLE pour les téléchargements de PDF
    db.run(`CREATE TABLE IF NOT EXISTS brochure_leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        date_telechargement DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;