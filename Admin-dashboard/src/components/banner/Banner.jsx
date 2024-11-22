import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BannerList = ({ onEdit }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://customizeproserver-ez6b5n9b.b4a.run/banner')
      .then((response) => response.json())
      .then((data) => {
        setBanners(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching banners:', error);
      });
  }, []);

  const handleEdit = (banner) => {
    navigate(`/banner/${banner._id}`, { state: { banner } }); 
  };

  if (loading) {
    return <p>Loading banners...</p>;
  }

  return (
    <div>
      <h2>Banner List</h2>
      <table>
        <thead>
          <tr>
            <th>Heading</th>
            <th>Text</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner._id}>
              <td>{banner.heading}</td>
              <td>{banner.text}</td>
              <td>{banner.category}</td>
              <td>
                {banner.imageUrl ? (
                  <img
                    src={`https://customizeproserver-ez6b5n9b.b4a.run/${banner.imageUrl.replace(/\\/g, '/')}`}
                    alt={banner.heading}
                    width="100"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(banner)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BannerList;
