const express = require('express');
const router = express.Router();
const db = require('../database/db');

const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const adminPassword = process.env.ADMIN_PASSWORD || 'NovaEnergyCo2026!';
    
    if (authHeader === adminPassword) {
        next();
    } else {
        res.status(401).json({ error: 'Accès refusé. Mot de passe incorrect.' });
    }
};

router.post('/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'NovaEnergyCo2026!';
    
    if (password === adminPassword) {
        res.json({ success: true, token: adminPassword });
    } else {
        res.status(401).json({ error: 'Mot de passe incorrect.' });
    }
});

router.get('/contacts', checkAuth, (req, res) => {
    db.query("SELECT * FROM contacts ORDER BY date_creation DESC", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

router.get('/downloads', checkAuth, (req, res) => {
    db.query("SELECT * FROM brochure_leads ORDER BY date_telechargement DESC", (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

router.delete('/contacts/:id', checkAuth, (req, res) => {
    db.query("DELETE FROM contacts WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

router.delete('/downloads/:id', checkAuth, (req, res) => {
    db.query("DELETE FROM brochure_leads WHERE id = ?", [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

module.exports = router;