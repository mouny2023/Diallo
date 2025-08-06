const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // ✅ CORREGIDO

const produitsFilePath = path.join(__dirname, 'produits.json');

// ✅ CORS: Permitir Netlify
const whitelist = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://chez-diallo.netlify.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

// ✅ Middlewares
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API GET: Listar productos
app.get('/api/produits', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  fs.readFile(produitsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error interno del servidor.');
    res.json(JSON.parse(data));
  });
});

// ✅ Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor completo démarré sur http://localhost:${port}`);
});
