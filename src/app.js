const express = require('express');
const app = express();
const PORT = 8080;


app.use(express.json());


const productsRouter = require('./routes/products.router.js');
const cartsRouter = require('./routes/carts.router.js');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
