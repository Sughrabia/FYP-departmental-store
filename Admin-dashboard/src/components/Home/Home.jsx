import React, { useState, useEffect } from 'react';
import './home.css'
import { Pages, Person, Category, ViewCarousel } from '@mui/icons-material';


const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalPages: 0,
    totalBanners: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, pagesRes, bannersRes] = await Promise.all([
          fetch('https://customizeproserver-ez6b5n9b.b4a.run/banner/count'),
          fetch('https://customizeproserver-ez6b5n9b.b4a.run/user/count'),
          fetch('https://glamgrabbackend-dxah8u9g.b4a.run/product/count'),
          fetch('https://glamgrabbackend-dxah8u9g.b4a.run/count'),
        ]);

        const totalUsers = await usersRes.json();
        const totalProducts = await productsRes.json();
        const totalPages = await pagesRes.json();
        const totalBanners = await bannersRes.json();

        setStats({
          totalUsers: totalUsers.total,
          totalProducts: totalProducts.total,
          totalPages: totalPages.total,
          totalBanners: totalBanners.total,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-stats">
      <div className="stat-box-1">
      <Person className="social-icon" style={{fontSize:'60px', color:'rgb(6, 184, 140)'}}  />
        <h2>Total Users</h2>
        <p>{stats.totalUsers}</p>
      </div>
      <div className="stat-box-2">
      <Category className="social-icon"   style={{fontSize:'60px', color:' red'}} />
        <h2>Total Products</h2>
        <p>{stats.totalProducts}</p>
      </div>
      <div className="stat-box-3">
      <Pages className="social-icon"  style={{fontSize:'60px', color:'blue'}} />
        <h2>Total Pages</h2>
        <p>{stats.totalPages}</p>
      </div>
      <div className="stat-box-4">
      <ViewCarousel className="social-icon"   style={{fontSize:'60px', color:'orange'}} />
        <h2>Total Banners</h2>
        <p>{stats.totalBanners}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
