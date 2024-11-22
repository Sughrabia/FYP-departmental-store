import React, { useEffect, useState } from 'react';
import './manageUser.css';

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://customizeproserver-ez6b5n9b.b4a.run/user');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`https://customizeproserver-ez6b5n9b.b4a.run/user/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setUsers(users.filter((user) => user._id !== userId));
                } else {
                    console.error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div>
            <h1>Manage Users</h1>
            {error && <p className="error-message">{error}</p>}
            {users.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id}>
                                <td>{index + 1}</td> 
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <button className='delete' onClick={() => handleDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No users found</p>
            )}
        </div>
    );
};

export default ManageUser;
