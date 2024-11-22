import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import './createproduct.css';

const EditProductPage = () => {
  const { id } = useParams();
  const [productData, setProductData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null); 
  const [additionalImages, setAdditionalImages] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value }); 
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file); 
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setAdditionalImages(files);
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://glamgrabbackend-dxah8u9g.b4a.run/product/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const data = await response.json();
        setProductData({
          name: data.name,
          category: data.category,
          price: data.price,
          description: data.description,
        });
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('category', productData.category);
    formData.append('price', productData.price);
    formData.append('description', productData.description);
    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }

    if (additionalImages.length > 0) {
      additionalImages.forEach((file) => {
        formData.append('additionalImages', file); 
      });
    }

    try {
      const response = await fetch(`https://glamgrabbackend-dxah8u9g.b4a.run/product/edit/${id}`, {
        method: 'PUT',
        body: formData, 
      });

      if (response.ok) {
        alert('Product updated successfully');
        navigate('/product'); 
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  
  if (loading) {
    return <div>Loading product data...</div>;
  }

  return (
    <div className="create-product-container">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category:
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kid">Kids</option>
            <option value="Popular">Popular</option>
          </select>
        </label>
        <label>
          Price:
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={productData.description}
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

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductPage;
