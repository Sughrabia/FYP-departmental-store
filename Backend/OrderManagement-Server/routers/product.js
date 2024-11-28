const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/product'); // Your Product model
const upload = require('../config/multerConfig'); // Multer configuration for file uploads

// Helper function to save files locally
const saveFileLocally = (filePath, destinationFolder, fileName) => {
  const destPath = path.join(destinationFolder, fileName);

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder, { recursive: true }); // Create the folder if it doesn't exist
  }

  fs.renameSync(filePath, destPath); // Move the file
  return `/images/${fileName}`; // Return the relative path for database storage
};

// Helper function to delete a file
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Delete the file if it exists
  }
};

// POST: Create a New Product
router.post(
  '/create',
  upload.fields([
    { name: 'imageUrl', maxCount: 1 }, // Main image
    { name: 'additionalImages', maxCount: 5 }, // Additional images
  ]),
  async (req, res) => {
    try {
      // Ensure a main image is uploaded
      if (!req.files['imageUrl'] || req.files['imageUrl'].length === 0) {
        return res.status(400).json({ message: 'Main image file is required.' });
      }

      const { name, category, price, description } = req.body;

      const imagesFolder = path.join(__dirname, '../images');

      // Save the main image locally
      const mainImageFile = req.files['imageUrl'][0];
      const imageUrl = saveFileLocally(
        mainImageFile.path,
        imagesFolder,
        `main_${Date.now()}_${mainImageFile.originalname}`
      );

      // Save additional images locally, if provided
      const additionalImages = req.files['additionalImages']
        ? req.files['additionalImages'].map(file =>
            saveFileLocally(
              file.path,
              imagesFolder,
              `additional_${Date.now()}_${file.originalname}`
            )
          )
        : [];

      // Save the product to the database
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
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Error creating product', error: error.message });
    }
  }
);

// PUT: Update an Existing Product
router.put(
  '/edit/:id',
  upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 },
  ]),
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const { name, category, price, description } = req.body;

      const imagesFolder = path.join(__dirname, '../images');

      // Update fields
      product.name = name || product.name;
      product.category = category || product.category;
      product.price = price || product.price;
      product.description = description || product.description;

      // Update the main image, if provided
      if (req.files['imageUrl'] && req.files['imageUrl'].length > 0) {
        const mainImageFile = req.files['imageUrl'][0];

        // Delete the old main image
        deleteFile(path.join(__dirname, '../', product.imageUrl));

        // Save the new main image
        product.imageUrl = saveFileLocally(
          mainImageFile.path,
          imagesFolder,
          `main_${Date.now()}_${mainImageFile.originalname}`
        );
      }

      // Update additional images, if provided
      if (req.files['additionalImages']) {
        // Delete old additional images
        product.additionalImages.forEach(image =>
          deleteFile(path.join(__dirname, '../', image))
        );

        // Save new additional images
        product.additionalImages = req.files['additionalImages'].map(file =>
          saveFileLocally(
            file.path,
            imagesFolder,
            `additional_${Date.now()}_${file.originalname}`
          )
        );
      }

      await product.save();
      res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error('Error updating product:', error.message);
      res.status(500).json({ message: 'Error updating product', error: error.message });
    }
  }
);

// GET: All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server Error');
  }
});

// GET: Product Count
router.get('/count', async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.json({ total: productCount });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching product count' });
  }
});

// GET: Product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID format' });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE: Product by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated images
    deleteFile(path.join(__dirname, '../', product.imageUrl));
    product.additionalImages.forEach(image =>
      deleteFile(path.join(__dirname, '../', image))
    );

    await Product.findByIdAndDelete(id);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

module.exports = router;
