import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './custompage.css'
const EditCustomPage = () => {
  const { slug } = useParams(); 
  const [pageData, setPageData] = useState({ title: '', content: '', slug: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await axios.get(`https://customizeproserver-ez6b5n9b.b4a.run/customPage/pages/${slug}`);
        setPageData(response.data);
      } catch (error) {
        console.error('Error fetching page data:', error);
      }
    };
    fetchPageData();
  }, [slug]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://customizeproserver-ez6b5n9b.b4a.run/customPage/edit-pages/${slug}`, pageData); // Use the correct update API
      navigate('/custompages');
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPageData({ ...pageData, [name]: value });
  };

  return (
    <div className="custom-page-container">
      <h1>Edit Custom Page</h1>
      <form className="custom-page-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={pageData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="slug">Slug:</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={pageData.slug}
            onChange={handleChange}
            required
            readOnly 
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            name="content"
            value={pageData.content}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate('/custompages')}>Cancel</button>
      </form>
    </div>
  );
};

export default EditCustomPage;
