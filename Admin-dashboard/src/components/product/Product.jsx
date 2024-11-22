import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './product.css';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://glamgrabbackend-dxah8u9g.b4a.run/product');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`https://glamgrabbackend-dxah8u9g.b4a.run/product/${productId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setProducts(products.filter((product) => product._id !== productId));
        } else {
          console.error('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Manage Products</h1>
      <Link to="/create-product">
        <button>Create New Product</button>
      </Link>
      {products.length > 0 ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Sr #</th>
                <th>Name</th>
                <th>Category</th>
                <th>Images</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr key={product._id}>
                  <td>{indexOfFirstProduct + index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td><img src={`https://glamgrabbackend-dxah8u9g.b4a.run/${product.imageUrl.replace(/\\/g, '/')}`}  alt={product.name} width="50" /></td>
                  <td>
                    <Link to={`/edit-product/${product._id}`}>
                      <button  className='edit-button'> Edit</button>
                    </Link>
                    <button className='delete' onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastProduct >= products.length}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default Product;
