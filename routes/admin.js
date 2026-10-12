const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Middleware de vérification du mot de passe
const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const adminPassword = process.env.ADMIN_PASSWORD || 'NovaEnergyCo2026!';
    
    if (authHeader === adminPassword) {
        next();
    } else {
        res.status(401).json({ error: 'Accès refusé. Mot de passe incorrect.' });
    }
};

// Route de connexion (vérifie le mot de passe)
router.post('/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'NovaEnergyCo2026!';
    
    if (password === adminPassword) {
        res.json({ success: true, token: adminPassword });
    } else {
        res.status(401).json({ error: 'Mot de passe incorrect.' });
    }
});

// Récupérer tous les contacts
router.get('/contacts', checkAuth, (req, res) => {
    db.all("SELECT * FROM contacts ORDER BY date_creation DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Récupérer tous les téléchargements de brochure
router.get('/downloads', checkAuth, (req, res) => {
    db.all("SELECT * FROM brochure_leads ORDER BY date_telechargement DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Supprimer un contact
router.delete('/contacts/:id', checkAuth, (req, res) => {
    db.run("DELETE FROM contacts WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Supprimer un téléchargement
router.delete('/downloads/:id', checkAuth, (req, res) => {
    db.run("DELETE FROM brochure_leads WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

module.exports = router;