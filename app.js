const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const contactRoute = require('./routes/contact');
const downloadRoute = require('./routes/download');
const adminRoute = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api/contact', contactRoute);
app.use('/api/download', downloadRoute);
app.use('/api/admin', adminRoute);

// Route pour la page admin
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// Route de test
app.get('/api/status', (req, res) => {
    res.json({ status: 'Le serveur NovaEnergyCo est opérationnel !' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});