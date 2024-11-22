import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate, Link } from 'react-router-dom';
import './custompage.css';

const CustomPages = () => {
  const [pages, setPages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axios.get('https://customizeproserver-ez6b5n9b.b4a.run/customPage/allpages');
        setPages(response.data);
      } catch (error) {
        console.log('Error fetching pages:', error);
      }
    };
    fetchPages();
  }, []);

  const handleDelete = async (slug) => {
    try {
      await axios.delete(`https://customizeproserver-ez6b5n9b.b4a.run/customPage/pages/${slug}`);
      setPages(pages.filter(page => page.slug !== slug)); // Update UI
    } catch (error) {
      console.log('Error deleting page:', error);
    }
  };

  return (
    <div className="admin-custom-pages-container">
      <h1>Custom Pages Management</h1>
      <Link to="/create-custompage"> 
        <button className="create-page-btn" onClick={() => navigate('/admin/create-custom-page')}>
          Create New Page
        </button>
      </Link>

      <table className="custom-pages-table">
        <thead>
          <tr>
            <th>Page Title</th>
            <th>Page Slug</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page.slug}>
              <td>{page.title}</td>
              <td>{page.slug}</td>
              <td>
                <button className='edit-button' onClick={() => navigate(`/edit-custompage/${page.slug}`)}>Edit</button>
                <button className='delete' onClick={() => handleDelete(page.slug)}>Delete</button> {/* Pass slug for deletion */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomPages;
