const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ProductManager {
  constructor(filename = 'data/products.json') {
    this.path = path.resolve(filename);
  }

  async _readFile() {
    try {
      const content = await fs.readFile(this.path, 'utf8');
      return JSON.parse(content || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') {
        await this._writeFile([]);
        return [];
      }
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.mkdir(path.dirname(this.path), { recursive: true });
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf8');
  }

  async getAll() {
    return await this._readFile();
  }

  async getById(pid) {
    const products = await this._readFile();
    return products.find(p => String(p.id) === String(pid)) || null;
  }

  async addProduct(productData) {
    const products = await this._readFile();

    const newProduct = {
      id: uuidv4(),
      title: productData.title ?? '',
      description: productData.description ?? '',
      code: productData.code ?? '',
      price: Number(productData.price ?? 0),
      status: productData.status !== undefined ? Boolean(productData.status) : true,
      stock: Number(productData.stock ?? 0),
      category: productData.category ?? '',
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(pid, updateData) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return null;

    const existing = products[idx];
    
    const allowed = { ...existing, ...updateData, id: existing.id };
    
    allowed.price = Number(allowed.price ?? existing.price);
    allowed.stock = Number(allowed.stock ?? existing.stock);
    allowed.status = allowed.status !== undefined ? Boolean(allowed.status) : existing.status;
    if (!Array.isArray(allowed.thumbnails)) allowed.thumbnails = existing.thumbnails;

    products[idx] = allowed;
    await this._writeFile(products);
    return products[idx];
  }

  async deleteProduct(pid) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return false;
    products.splice(idx, 1);
    await this._writeFile(products);
    return true;
  }
}

module.exports = ProductManager;
