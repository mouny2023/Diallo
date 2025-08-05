const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname)); // Sert les fichiers statiques (html, css, etc.)

// Route API pour les produits
app.get('/api/produits', (req, res) => {
  fs.readFile('produits.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Erreur de lecture du fichier produits.json:", err);
      return res.status(500).send('Erreur interne du serveur.');
    }
    res.json(JSON.parse(data));
  });
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Serveur complet démarré sur http://localhost:${port}`);
});