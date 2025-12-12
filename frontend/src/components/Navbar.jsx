import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1>Customer Management System</h1>
        <ul className="nav-links">
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/customers" className={location.pathname === '/customers' ? 'active' : ''}>
              Customers
            </Link>
          </li>
          <li>
            <Link to="/add-customer" className={location.pathname === '/add-customer' ? 'active' : ''}>
              Add Customer
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
