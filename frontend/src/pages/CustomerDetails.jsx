import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { customerAPI, financialAPI, transactionAPI } from '../services/api';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [financialDetails, setFinancialDetails] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchCustomerData();
  }, [id]);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [customerRes, financialRes, transactionsRes] = await Promise.all([
        customerAPI.getById(id),
        financialAPI.getByCustomerId(id),
        transactionAPI.getByCustomerId(id),
      ]);
      
      setCustomer(customerRes.data);
      setFormData(customerRes.data);
      setFinancialDetails(financialRes.data);
      setTransactions(transactionsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch customer data');
      console.error('Error fetching customer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await customerAPI.update(id, formData);
      setCustomer(formData);
      setEditMode(false);
    } catch (err) {
      alert('Failed to update customer');
      console.error('Error updating customer:', err);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading customer details...</div></div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button onClick={() => navigate('/customers')} className="btn btn-secondary">
          Back to Customers
        </button>
      </div>
    );
  }

  if (!customer) {
    return <div className="container"><div className="error">Customer not found</div></div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex-between mb-2">
          <h2>Customer Details</h2>
          <div className="flex-end">
            <button onClick={() => navigate('/customers')} className="btn btn-secondary">
              Back to List
            </button>
            <Link to={`/customers/${id}/financial`} className="btn btn-success">
              Manage Financial Details
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '2px solid #ddd', marginBottom: '1rem' }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === 'details' ? '#3498db' : 'transparent',
              color: activeTab === 'details' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Customer Information
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === 'financial' ? '#3498db' : 'transparent',
              color: activeTab === 'financial' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Financial Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === 'transactions' ? '#3498db' : 'transparent',
              color: activeTab === 'transactions' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Transactions
          </button>
        </div>

        {/* Customer Information Tab */}
        {activeTab === 'details' && (
          <div>
            {!editMode ? (
              <>
                <div className="info-grid">
                  <div className="info-item">
                    <label>First Name</label>
                    <div className="value">{customer.first_name}</div>
                  </div>
                  <div className="info-item">
                    <label>Last Name</label>
                    <div className="value">{customer.last_name}</div>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <div className="value">{customer.email}</div>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <div className="value">{customer.phone}</div>
                  </div>
                  <div className="info-item">
                    <label>Address</label>
                    <div className="value">{customer.address}</div>
                  </div>
                  <div className="info-item">
                    <label>City</label>
                    <div className="value">{customer.city}</div>
                  </div>
                  <div className="info-item">
                    <label>State</label>
                    <div className="value">{customer.state}</div>
                  </div>
                  <div className="info-item">
                    <label>ZIP Code</label>
                    <div className="value">{customer.zip_code}</div>
                  </div>
                  <div className="info-item">
                    <label>Country</label>
                    <div className="value">{customer.country}</div>
                  </div>
                </div>
                <div className="flex-end mt-2">
                  <button onClick={() => setEditMode(true)} className="btn btn-primary">
                    Edit Customer
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      name="zip_code"
                      value={formData.zip_code || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="flex-end mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setFormData(customer);
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Financial Overview Tab */}
        {activeTab === 'financial' && (
          <div>
            {financialDetails.length === 0 ? (
              <div className="text-center" style={{ padding: '2rem' }}>
                <p>No financial details found for this customer.</p>
                <Link to={`/customers/${id}/financial`} className="btn btn-primary mt-2">
                  Add Financial Details
                </Link>
              </div>
            ) : (
              <div>
                {financialDetails.map((detail) => (
                  <div key={detail._id} className="card" style={{ marginBottom: '1rem' }}>
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Account Number</label>
                        <div className="value">{detail.account_number}</div>
                      </div>
                      <div className="info-item">
                        <label>Account Type</label>
                        <div className="value">{detail.account_type}</div>
                      </div>
                      <div className="info-item">
                        <label>Balance</label>
                        <div className="value">${detail.balance.toFixed(2)}</div>
                      </div>
                      <div className="info-item">
                        <label>Employment Status</label>
                        <div className="value">{detail.employment_status}</div>
                      </div>
                      {detail.credit_limit && (
                        <div className="info-item">
                          <label>Credit Limit</label>
                          <div className="value">${detail.credit_limit.toFixed(2)}</div>
                        </div>
                      )}
                      {detail.monthly_income && (
                        <div className="info-item">
                          <label>Monthly Income</label>
                          <div className="value">${detail.monthly_income.toFixed(2)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div>
            {transactions.length === 0 ? (
              <div className="text-center" style={{ padding: '2rem' }}>
                <p>No transactions found for this customer.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Category</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction._id}>
                        <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            background: transaction.transaction_type === 'credit' ? '#d4edda' : '#f8d7da',
                            color: transaction.transaction_type === 'credit' ? '#155724' : '#721c24',
                          }}>
                            {transaction.transaction_type}
                          </span>
                        </td>
                        <td>${transaction.amount.toFixed(2)}</td>
                        <td>{transaction.category}</td>
                        <td>{transaction.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
