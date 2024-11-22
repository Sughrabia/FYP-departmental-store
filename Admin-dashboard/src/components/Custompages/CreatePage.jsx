import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import './custompage.css';

const CreateCustomPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://customizeproserver-ez6b5n9b.b4a.run/customPage/admin/pages', { title, content, slug });
      setMessage(response.data.message);
      if (response.status === 200) {
        navigate('/admin/custom-pages');
      }
    } catch (error) {
      setMessage('Error saving page');
    }
  };

  return (
    <div className="custom-page-container">
      <h2>Create New Custom Page</h2>
      <form className="custom-page-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Page Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Slug (URL)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
        <textarea
          placeholder="Page Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" onClick={() => navigate('/custompages')}>Create</button>
        <button type="button" onClick={() => navigate('/custompages')}>Cancel</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateCustomPage;
