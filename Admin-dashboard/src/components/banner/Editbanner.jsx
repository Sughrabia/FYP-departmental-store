import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import './banner.css';

const EditBanner = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    heading: '',
    text: '',
    buttonLabel: '',
    image: null, // Changed from imageUrl to imageFile for consistency
    category: '',
    _id: '' // Added _id to the state
  });

  useEffect(() => {
    if (location.state && location.state.banner) {
      const { heading, text, buttonLabel, category, _id } = location.state.banner;
      setFormData({
        heading,
        text,
        buttonLabel,
        image: null, 
        category: category || '', 
        _id 
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFile: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    formDataToSend.append('heading', formData.heading);
    formDataToSend.append('text', formData.text);
    formDataToSend.append('buttonLabel', formData.buttonLabel);
    if (formData.imageFile) {
      formDataToSend.append('image', formData.imageFile);
    }
    formDataToSend.append('category', formData.category);
  
    const response = await fetch(`https://customizeproserver-ez6b5n9b.b4a.run/banner/edit/${formData._id}`, {
      method: 'PUT',
      body: formDataToSend,
    });
  
    if (response.ok) {
      const updatedBanner = await response.json();
      console.log('Banner updated successfully:', updatedBanner);
      navigate('/banner');
  
      // Update the state to reflect the new banner data
      setIsLoading(false);
      setMessage('Banner updated successfully!');
    } else {
      const errorMsg = await response.text();
      setMessage(`Error updating banner: ${errorMsg}`);
    }
  };
  
  
  return (
    <div className="Edit-banner-container">
      <h2>Edit Banner</h2>
      <form onSubmit={handleSubmit} className="Edit-banner-form">
        <input
          type="text"
          name="heading"
          placeholder="Heading"
          value={formData.heading}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="text"
          placeholder="Text"
          value={formData.text}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="buttonLabel"
          placeholder="Button Label"
          value={formData.buttonLabel}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        
        <button type="submit" disabled={isLoading}>Update</button>
      </form>

      {isLoading && <p>Updating banner...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default EditBanner;
