const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.post('/', (req, res) => {
    const { nom, email, telephone, service, message } = req.body;

    if (!nom || !email || !message) {
        return res.status(400).json({ error: 'Veuillez remplir les champs obligatoires (Nom, Email, Message).' });
    }

    const sql = `INSERT INTO contacts (nom, email, telephone, service, message) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(sql, [nom, email, telephone, service, message], (err, results) => {
        if (err) {
            console.error("Erreur d'insertion :", err.message);
            return res.status(500).json({ error: "Erreur lors de l'enregistrement des données." });
        }
        res.status(201).json({ message: 'Votre demande a bien été enregistrée ! Nous vous contacterons bientôt.' });
    });
});

module.exports = router;