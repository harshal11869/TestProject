import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CustomerList from './pages/CustomerList';
import AddCustomer from './pages/AddCustomer';
import CustomerDetails from './pages/CustomerDetails';
import FinancialDetails from './pages/FinancialDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/add-customer" element={<AddCustomer />} />
          <Route path="/customers/:id" element={<CustomerDetails />} />
          <Route path="/customers/:id/financial" element={<FinancialDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
