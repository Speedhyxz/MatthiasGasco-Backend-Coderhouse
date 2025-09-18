const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const ProductManager = require('../managers/ProductManager.js');

const cm = new CartManager();
const pm = new ProductManager();

router.post('/', async (req, res) => {
  try {
    const newCart = await cm.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: 'Error creando carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
  } catch (err) {
    res.status(500).json({ error: 'Error leyendo carrito' });
  }
});


router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;


    const product = await pm.getById(pid);
    if (!product) return res.status(404).json({ error: 'Producto no existe' });

  
    const result = await cm.addProductToCart(cid, pid);
    if (result && result.error) return res.status(404).json(result);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error agregando producto al carrito' });
  }
});

module.exports = router;
