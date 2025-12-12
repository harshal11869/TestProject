import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI, financialAPI, transactionAPI } from '../services/api';

const FinancialDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [financialDetails, setFinancialDetails] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [financialForm, setFinancialForm] = useState({
    customer_id: id,
    account_number: '',
    account_type: 'checking',
    balance: '',
    credit_limit: '',
    monthly_income: '',
    employment_status: '',
  });

  const [transactionForm, setTransactionForm] = useState({
    customer_id: id,
    transaction_type: 'credit',
    amount: '',
    description: '',
    category: '',
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [customerRes, financialRes] = await Promise.all([
        customerAPI.getById(id),
        financialAPI.getByCustomerId(id),
      ]);
      
      setCustomer(customerRes.data);
      setFinancialDetails(financialRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinancialChange = (e) => {
    setFinancialForm({
      ...financialForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleTransactionChange = (e) => {
    setTransactionForm({
      ...transactionForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddFinancial = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...financialForm,
        balance: parseFloat(financialForm.balance),
        credit_limit: financialForm.credit_limit ? parseFloat(financialForm.credit_limit) : null,
        monthly_income: financialForm.monthly_income ? parseFloat(financialForm.monthly_income) : null,
      };
      await financialAPI.create(data);
      await fetchData();
      setShowAddForm(false);
      setFinancialForm({
        customer_id: id,
        account_number: '',
        account_type: 'checking',
        balance: '',
        credit_limit: '',
        monthly_income: '',
        employment_status: '',
      });
    } catch (err) {
      alert('Failed to add financial details');
      console.error('Error adding financial details:', err);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
      };
      await transactionAPI.create(data);
      setShowTransactionForm(false);
      setTransactionForm({
        customer_id: id,
        transaction_type: 'credit',
        amount: '',
        description: '',
        category: '',
      });
      alert('Transaction added successfully');
    } catch (err) {
      alert('Failed to add transaction');
      console.error('Error adding transaction:', err);
    }
  };

  const handleDeleteFinancial = async (financialId) => {
    if (window.confirm('Are you sure you want to delete this financial detail?')) {
      try {
        await financialAPI.delete(financialId);
        await fetchData();
      } catch (err) {
        alert('Failed to delete financial details');
        console.error('Error deleting financial details:', err);
      }
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  if (error) {
    return <div className="container"><div className="error">{error}</div></div>;
  }

  return (
    <div className="container">
      <div className="card">
        <div className="flex-between mb-2">
          <h2>Financial Details - {customer?.first_name} {customer?.last_name}</h2>
          <button onClick={() => navigate(`/customers/${id}`)} className="btn btn-secondary">
            Back to Customer
          </button>
        </div>

        <div className="flex-between mb-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
          >
            {showAddForm ? 'Cancel' : 'Add Financial Details'}
          </button>
          <button
            onClick={() => setShowTransactionForm(!showTransactionForm)}
            className="btn btn-success"
          >
            {showTransactionForm ? 'Cancel' : 'Add Transaction'}
          </button>
        </div>

        {/* Add Financial Details Form */}
        {showAddForm && (
          <div className="card" style={{ background: '#f8f9fa', marginBottom: '1rem' }}>
            <h3>Add Financial Details</h3>
            <form onSubmit={handleAddFinancial}>
              <div className="form-row">
                <div className="form-group">
                  <label>Account Number *</label>
                  <input
                    type="text"
                    name="account_number"
                    value={financialForm.account_number}
                    onChange={handleFinancialChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Account Type *</label>
                  <select
                    name="account_type"
                    value={financialForm.account_type}
                    onChange={handleFinancialChange}
                    required
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Balance *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="balance"
                    value={financialForm.balance}
                    onChange={handleFinancialChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Credit Limit</label>
                  <input
                    type="number"
                    step="0.01"
                    name="credit_limit"
                    value={financialForm.credit_limit}
                    onChange={handleFinancialChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Income</label>
                  <input
                    type="number"
                    step="0.01"
                    name="monthly_income"
                    value={financialForm.monthly_income}
                    onChange={handleFinancialChange}
                  />
                </div>
                <div className="form-group">
                  <label>Employment Status *</label>
                  <select
                    name="employment_status"
                    value={financialForm.employment_status}
                    onChange={handleFinancialChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>

              <div className="flex-end mt-2">
                <button type="submit" className="btn btn-primary">
                  Add Financial Details
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add Transaction Form */}
        {showTransactionForm && (
          <div className="card" style={{ background: '#f8f9fa', marginBottom: '1rem' }}>
            <h3>Add Transaction</h3>
            <form onSubmit={handleAddTransaction}>
              <div className="form-row">
                <div className="form-group">
                  <label>Transaction Type *</label>
                  <select
                    name="transaction_type"
                    value={transactionForm.transaction_type}
                    onChange={handleTransactionChange}
                    required
                  >
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="amount"
                    value={transactionForm.amount}
                    onChange={handleTransactionChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={transactionForm.category}
                    onChange={handleTransactionChange}
                    placeholder="e.g., Salary, Purchase, Payment"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <input
                    type="text"
                    name="description"
                    value={transactionForm.description}
                    onChange={handleTransactionChange}
                    required
                  />
                </div>
              </div>

              <div className="flex-end mt-2">
                <button type="submit" className="btn btn-success">
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Financial Details List */}
        {financialDetails.length === 0 ? (
          <div className="text-center" style={{ padding: '2rem' }}>
            <p>No financial details found. Add the first one!</p>
          </div>
        ) : (
          <div>
            {financialDetails.map((detail) => (
              <div key={detail._id} className="card" style={{ marginBottom: '1rem' }}>
                <div className="flex-between mb-2">
                  <h3>Account: {detail.account_number}</h3>
                  <button
                    onClick={() => handleDeleteFinancial(detail._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Account Type</label>
                    <div className="value">{detail.account_type}</div>
                  </div>
                  <div className="info-item">
                    <label>Balance</label>
                    <div className="value" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                      ${detail.balance.toFixed(2)}
                    </div>
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
    </div>
  );
};

export default FinancialDetails;
