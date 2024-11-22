import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { Home, Pages, Settings, Person, Category,  KeyboardArrowRight, ViewCarousel } from '@mui/icons-material';

function Dashboard({ children }) {
  return (
    <div className="dashboard">
      <nav className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li>
            <Home className="social-icon" />
            <Link to="/admin">Home</Link>
            <KeyboardArrowRight className="Arrow-icon" />
          </li>
          <li>
            <Pages className="social-icon" />
            <Link to="/custompages">custom pages</Link>
            <KeyboardArrowRight className="Arrow-icon" />
          </li>
          <li>
            <Settings className="social-icon" />
            <Link to="/settings">Settings</Link>
            <KeyboardArrowRight className="Arrow-icon" />
          </li>
          <li>
            <Person className="social-icon" />
            <Link to="/user">users</Link>
            <KeyboardArrowRight className="Arrow-icon" />
          </li>
          <li>
            <Category className="social-icon" />
            <Link to="/product">products</Link>
            <KeyboardArrowRight className="Arrow-icon" />
          </li>
          <li>
            <ViewCarousel className="social-icon" />
            <Link to="/banner">Banners</Link>
            <KeyboardArrowRight className="Arrow-icon" />
          </li>
          <li>
            <ViewCarousel className="social-icon" />
            <Link to="/order">Order</Link>
            <KeyboardArrowRight className="Arrow-icon" />
          </li>
          
        </ul>
      </nav>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default Dashboard;
