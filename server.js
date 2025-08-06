// Contenido FINAL para server.js (con CRUD completo: GET, POST, DELETE, PUT)

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;
const produitsFilePath = path.join(__dirname, 'produits.json');

app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET (Leer todos los productos)
app.get('/api/produits', (req, res) => {
  fs.readFile(produitsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error interno del servidor.');
    res.json(JSON.parse(data));
  });
});

// POST (Añadir un nuevo producto)
app.post('/api/produits', (req, res) => {
  const newProductData = req.body;
  fs.readFile(produitsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer la base de datos.');
    const products = JSON.parse(data);
    let maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    const newProduct = { ...newProductData, id: maxId + 1 };
    products.push(newProduct);
    fs.writeFile(produitsFilePath, JSON.stringify(products, null, 2), 'utf8', (writeErr) => {
      if (writeErr) return res.status(500).send('Error al guardar el nuevo producto.');
      res.status(201).json({ message: 'Producto añadido con éxito' });
    });
  });
});

// DELETE (Borrar un producto)
app.delete('/api/produits/:id', (req, res) => {
  const productId = req.params.id;
  fs.readFile(produitsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error al leer la base de datos.');
    let products = JSON.parse(data);
    const newProductsList = products.filter(p => p.id != productId);
    if (products.length === newProductsList.length) {
      return res.status(404).send('Producto no encontrado.');
    }
    fs.writeFile(produitsFilePath, JSON.stringify(newProductsList, null, 2), 'utf8', (writeErr) => {
      if (writeErr) return res.status(500).send('Error al borrar el producto.');
      res.status(200).json({ message: 'Producto borrado con éxito' });
    });
  });
});

// ✅ NUEVO: RUTA PUT (Actualizar/Editar un producto)
app.put('/api/produits/:id', (req, res) => {
    const productId = req.params.id;
    const updatedProductData = req.body; // Viene sin ID

    fs.readFile(produitsFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer la base de datos.');
        let products = JSON.parse(data);

        // Buscamos el índice del producto a actualizar
        const productIndex = products.findIndex(p => p.id == productId);

        if (productIndex === -1) {
            return res.status(404).send('Producto no encontrado para actualizar.');
        }

        // Actualizamos los datos del producto, manteniendo su ID original
        products[productIndex] = { 
            ...products[productIndex], // Mantiene el ID y cualquier otro campo
            ...updatedProductData      // Sobrescribe nom, prix, image
        };

        fs.writeFile(produitsFilePath, JSON.stringify(products, null, 2), 'utf8', (writeErr) => {
            if (writeErr) return res.status(500).send('Error al actualizar el producto.');
            res.status(200).json({ message: 'Producto actualizado con éxito' });
        });
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor completo démarré sur http://localhost:${port}`);
});