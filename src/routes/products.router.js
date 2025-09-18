const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager.js');
const pm = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const products = await pm.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error leyendo productos' });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const product = await pm.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error leyendo producto' });
  }
});

router.post('/', async (req, res) => {
  try {
    
    const body = { ...req.body };
    delete body.id;
    const newProduct = await pm.addProduct(body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error creando producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const body = { ...req.body };
    delete body.id; 
    const updated = await pm.updateProduct(pid, body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await pm.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error eliminando producto' });
  }
});

module.exports = router;
