import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './setting.css';

function Settings() {
  const [title, setTitle] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  // Fetch settings from the backend
  const fetchSettings = async () => {
    try {
      const response = await axios.get('https://customizeproserver-ez6b5n9b.b4a.run/setting/get');
      setTitle(response.data.title);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Update settings
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('title', title);
    if (logoFile) formData.append('logo', logoFile);

    try {
      const response = await axios.put('https://customizeproserver-ez6b5n9b.b4a.run/setting/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Update response:', response.data);
      fetchSettings(); // Re-fetch settings to ensure updated data
      alert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings. Please try again.');
    }
  };

  return (
    <div className="settings-container">
      <h1>Website Settings</h1>
      <div className="settings-form">
        <div className="form-group">
          <label>Website Title*</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Website Logo*</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0])}
            style={{ display: 'none' }}
            id="logo-upload"
          />
          <label htmlFor="logo-upload" className="upload-button">Browse</label>
        </div>
        <button className="save-button" onClick={handleUpdate}>Save Changes</button>
      </div>
    </div>
  );
}

export default Settings;
