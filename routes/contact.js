const express = require('express');
const router = express.Router();
const db = require('../database/db'); // On importe notre connexion à la base SQLite

// Route POST pour recevoir les données du formulaire
router.post('/', (req, res) => {
    // On récupère les données envoyées par le frontend
    const { nom, email, telephone, service, message } = req.body;

    // Petite validation des champs obligatoires
    if (!nom || !email || !message) {
        return res.status(400).json({ error: 'Veuillez remplir les champs obligatoires (Nom, Email, Message).' });
    }

    // Requête SQL pour insérer les données
    const sql = `INSERT INTO contacts (nom, email, telephone, service, message) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [nom, email, telephone, service, message], function(err) {
        if (err) {
            console.error("Erreur d'insertion :", err.message);
            return res.status(500).json({ error: "Erreur lors de l'enregistrement des données." });
        }
        // Si tout se passe bien, on renvoie un message de succès
        res.status(201).json({ message: 'Votre demande a bien été enregistrée ! Nous vous contacterons bientôt.' });
    });
});

module.exports = router;