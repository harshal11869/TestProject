import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to Customer Management System</h2>
        <p style={{ marginTop: '1rem', fontSize: '1.1rem', color: '#555' }}>
          This application helps you manage customer information and financial details efficiently.
        </p>
        
        <div className="info-grid" style={{ marginTop: '2rem' }}>
          <div className="info-item">
            <label>Customer Management</label>
            <div className="value">Add, view, update, and delete customer information</div>
          </div>
          <div className="info-item">
            <label>Financial Details</label>
            <div className="value">Track customer financial information and accounts</div>
          </div>
          <div className="info-item">
            <label>Transactions</label>
            <div className="value">Monitor customer transaction history</div>
          </div>
          <div className="info-item">
            <label>Responsive Design</label>
            <div className="value">Access from any device - desktop, tablet, or mobile</div>
          </div>
        </div>

        <div className="flex-between" style={{ marginTop: '2rem' }}>
          <Link to="/customers" className="btn btn-primary">
            View All Customers
          </Link>
          <Link to="/add-customer" className="btn btn-success">
            Add New Customer
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>Features</h2>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem', lineHeight: '2' }}>
          <li>Create and manage customer profiles with detailed information</li>
          <li>Track financial details including account information and balances</li>
          <li>Record and view customer transactions</li>
          <li>Responsive design that works on all devices</li>
          <li>Easy-to-use interface for quick data entry and retrieval</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
