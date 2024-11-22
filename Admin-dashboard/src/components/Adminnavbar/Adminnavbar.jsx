import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './adminnavbar.css';

const Adminnavbar = () => {
  const [settings, setSettings] = useState({ title: '', logo: '' });

  useEffect(() => {
    // Fetch the title and logo from the backend API
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/setting/get'); // Adjust the URL as per your backend route
        if (response.data) {
          setSettings({
            title: response.data.title,
            logo: response.data.logo,
          });
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={settings.logo || 'default-logo-url'} alt="DressDynamo Logo" className="navbar-logo" />
        <span className="navbar-brand">{settings.title || 'DressDynamo'}</span>
      </div>

      <div className="navbar-right">
        <img src="profile-url" alt="Profile" className="navbar-profile" />
      </div>
    </div>
  );
};

export default Adminnavbar;
