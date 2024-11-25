const express = require('express');
const router = express.Router();
const path = require('path');
const Product = require('../models/product');
const upload = require('../config/multerConfig'); // Multer config

// POST: Create a New Product
router.post(
  '/create',
  upload.fields([
    { name: 'imageUrl', maxCount: 1 }, // Main image
    { name: 'additionalImages', maxCount: 5 }, // Additional images
  ]),
  async (req, res) => {
    try {
      const { name, category, price, description } = req.body;

      // Check if the main image is uploaded
      if (!req.files['imageUrl'] || req.files['imageUrl'].length === 0) {
        return res.status(400).json({ message: 'Main image is required' });
      }

      // Main image path
      const imageUrl = req.files['imageUrl'][0].path;

      // Additional images paths
      const additionalImages = req.files['additionalImages']
        ? req.files['additionalImages'].map(file => file.path)
        : [];

      // Save to the database
      const newProduct = new Product({
        name,
        category,
        price,
        imageUrl,
        additionalImages,
        description,
      });

      await newProduct.save();
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      console.error('Error creating product:', error.message);
      res.status(500).json({ message: 'Error creating product', error: error.message });
    }
  }
);

// PUT: Update a Product
router.put(
  '/edit/:id',
  upload.fields([
    { name: 'imageUrl', maxCount: 1 }, // Main image
    { name: 'additionalImages', maxCount: 5 }, // Additional images
  ]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const { name, category, price, description } = req.body;

      // Update product fields
      product.name = name || product.name;
      product.category = category || product.category;
      product.price = price || product.price;
      product.description = description || product.description;

      // Update main image if uploaded
      if (req.files['imageUrl'] && req.files['imageUrl'].length > 0) {
        product.imageUrl = req.files['imageUrl'][0].path;
      }

      // Update additional images if uploaded
      if (req.files['additionalImages']) {
        product.additionalImages = req.files['additionalImages'].map(file => file.path);
      }

      await product.save();
      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error('Error updating product:', error.message);
      res.status(500).json({ message: 'Error updating product', error: error.message });
    }
  }
);

// GET: Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// DELETE: Delete a Product by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

module.exports = router;

