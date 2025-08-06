// Contenido FINAL Y DEFINITIVO para server.js (funciona en Localhost y en Render)

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;
const produitsFilePath = path.join(__dirname, 'produits.json');

// ✅ INICIO DE LA CONFIGURACIÓN DE CORS
// Creamos una "lista blanca" de las direcciones que tienen permiso.
const whitelist = [
  'http://localhost:3000', 
  'http://127.0.0.1:3000',
  'https://chez-diallo.netlify.app' // ✅ TU URL DE NETLIFY YA ESTÁ INCLUIDA AQUÍ
];

const corsOptions = {
  origin: function (origin, callback) {
    // Si el origen de la petición está en nuestra lista blanca (o si no hay origen)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Se permite la petición
    } else {
      callback(new Error('Not allowed by CORS')); // Se bloquea la petición
    }
  }
};
app.use(cors(corsOptions));
// ✅ FIN DE LA CONFIGURACIÓN DE CORS

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- El resto de tus rutas GET, POST, DELETE, PUT no cambian ---

app.get('/api/produits', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  fs.readFile(produitsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error interno del servidor.');
    res.json(JSON.parse(data));
  });
});

// ... (aquí van tus otras rutas app.post, app.delete, app.put, que no necesitan cambios) ...


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor completo démarré sur http://localhost:${port}`);
});