import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerAPI } from '../services/api';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAll();
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customers. Please make sure the backend is running.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id);
        setCustomers(customers.filter(c => c._id !== id));
      } catch (err) {
        alert('Failed to delete customer');
        console.error('Error deleting customer:', err);
      }
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading customers...</div></div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex-between">
          <h2>Customer List</h2>
          <Link to="/add-customer" className="btn btn-success">
            Add New Customer
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        {customers.length === 0 ? (
          <div className="text-center" style={{ padding: '2rem' }}>
            <p>No customers found. Add your first customer!</p>
            <Link to="/add-customer" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Add Customer
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer._id}>
                    <td>{customer.first_name} {customer.last_name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.city}</td>
                    <td>{customer.state}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          to={`/customers/${customer._id}`}
                          className="btn btn-primary"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerList;
