const express = require('express');
const router = express.Router();
const db = require('../database/db');
const path = require('path');

// Route POST pour enregistrer l'email et déclencher le téléchargement
router.post('/', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "L'adresse email est requise pour télécharger la brochure." });
    }

    // 1. Enregistrer l'email dans la base de données
    const sql = `INSERT INTO brochure_leads (email) VALUES (?)`;
    
    db.run(sql, [email], function(err) {
        if (err) {
            console.error("Erreur d'insertion brochure :", err.message);
            return res.status(500).json({ error: "Erreur lors de l'enregistrement de l'email." });
        }

        // 2. Si tout est bon, on envoie le fichier PDF
        // Le fichier doit se trouver dans public/pdf/brochure.pdf
        const pdfPath = path.join(__dirname, '../public/pdf/brochure.pdf');
        
        res.download(pdfPath, 'NovaEnergyCo_Brochure.pdf', (err) => {
            if (err) {
                console.error("Erreur lors de l'envoi du fichier :", err.message);
                // Si le fichier n'existe pas, on prévient le frontend
                if (!res.headersSent) {
                    res.status(500).json({ error: "Le fichier PDF est introuvable sur le serveur." });
                }
            }
        });
    });
});

module.exports = router;