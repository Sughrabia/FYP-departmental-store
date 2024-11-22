import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './order.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/order');
        setOrders(response.data);
      } catch (error) {
        setError('Failed to fetch order history');
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrderHistory();
  }, []);

  const handleOkClick = () => {
    navigate('/');
  };

  return (
    <div className="order-history-container">
      <h2 className="order-history-title">Order History</h2>
      {error && <div className="error-message">{error}</div>}
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>${order.totalAmount}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="order-actions">
        <button className="ok-button" onClick={handleOkClick}>OK</button>
      </div>
    </div>
  );
};

export default OrderHistory;
