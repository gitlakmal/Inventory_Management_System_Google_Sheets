// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Navigation from './components/Navigation';
import './App.css';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={isActive ? "active" : ""}>
      {children}
    </Link>
  );
};

function AppContent() {
  // Category State එක මෙතන තියාගන්නවා
  const [currentCategory, setCurrentCategory] = useState('inventory');

  return (
    <div className="app-container">
      
      {/* Sidebar Area */}
      <div className="sidebar">
        <div className="sidebar-title">🏥 Hospital Store</div>
        <NavLink to="/">📦 ප්‍රධාන ඉන්වෙන්ට්‍රිය</NavLink>
        <NavLink to="/distribute">📤 බෙදාදීම් වාර්තා</NavLink>
        <NavLink to="/refill">📥 රීෆිල් වාර්තා</NavLink>
      </div>

      {/* Main Content Area */}
      <div className="content">
        
        {/* Navigation එකට State එක යවනවා */}
        <Navigation 
          currentCategory={currentCategory} 
          onCategoryChange={setCurrentCategory} 
        />

        {/* PAGE CONTENT (Routes) */}
        <Routes>
          {/* Inventory එකටත් State එක යවනවා */}
          <Route path="/" element={<Inventory currentCategory={currentCategory} />} />
          <Route path="/distribute" element={<div className="card"><h2>බෙදාදීම් පිටුව</h2></div>} />
          <Route path="/refill" element={<div className="card"><h2>රීෆිල් පිටුව</h2></div>} />
        </Routes>

      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;