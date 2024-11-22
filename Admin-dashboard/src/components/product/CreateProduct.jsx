import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './createproduct.css';

const CreateProductPage = () => {
  const [imageFile, setImageFile] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', newProduct.name);
    data.append('category', newProduct.category);
    data.append('price', newProduct.price);
    data.append('description', newProduct.description);
    
    // Sending the main image file to Cloudinary
    if (imageFile) {
      data.append('imageUrl', imageFile); 
    }

    // Sending additional images to Cloudinary
    if (additionalImages.length > 0) {
      additionalImages.forEach((file) => {
        data.append('additionalImages', file); 
      });
    }

    try {
      const response = await fetch('https://glamgrabbackend-dxah8u9g.b4a.run/product/create', {
        method: 'POST',
        body: data, 
      });

      if (response.ok) {
        // const data\\\\ = await response.json();
        // You can now use result.savedProduct to access the product and its Cloudinary URLs
        alert('Product created successfully');
        setNewProduct({
          name: '',
          category: '',
          price: '',
          description: '',
        });
        setImageFile(null);
        setAdditionalImages([]);
        navigate('/product');
      } else {
        console.error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="create-product-container">
      <h1>Create New Product</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category:
          <select
            name="category"
            value={newProduct.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="kid">Kids</option>
            <option value="Popular">Popular</option>
          </select>
        </label>

        <label>
          Price:
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Main Image:
          <input
            type="file"
            name="imageUrl"
            onChange={handleImageChange}
            required 
          />
        </label>

        {imageFile && (
          <img src={URL.createObjectURL(imageFile)} alt="Preview" width="100" />
        )}
        <label>
          Additional Images:
          <input
            type="file"
            name="additionalImages"
            multiple
            onChange={handleAdditionalImagesChange}
          />
        </label>
        {additionalImages.length > 0 && (
          <div className="image-previews">
            {additionalImages.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                width="100"
              />
            ))}
          </div>
        )}

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProductPage;
