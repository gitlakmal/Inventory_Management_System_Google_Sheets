// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Inventory from './pages/Inventory';
import Distribute from './pages/Distribute';
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
  const [currentCategory, setCurrentCategory] = useState('inventory');
  
  // මෙතන තිබුණු searchQuery අයින් කළා, දැන් ඒක පිටු ඇතුළෙමයි තියෙන්නේ

  return (
    <div className="app-container">
      
      <div className="sidebar">
        <div className="sidebar-title">🏥 Hospital Store</div>
        <NavLink to="/">📦 ප්‍රධාන ඉන්වෙන්ට්‍රිය</NavLink>
        <NavLink to="/distribute">📤 බෙදාදීම් වාර්තා</NavLink>
        <NavLink to="/refill">📥 රීෆිල් වාර්තා</NavLink>
      </div>

      <div className="content">
        {/* Navigation එකට යවන්නේ currentCategory පමණයි */}
        <Navigation 
          currentCategory={currentCategory} 
          onCategoryChange={setCurrentCategory}
        />

        <Routes>
          {/* පිටු වලටත් යවන්නේ currentCategory පමණයි */}
          <Route path="/" element={<Inventory currentCategory={currentCategory} />} />
          <Route path="/distribute" element={<Distribute currentCategory={currentCategory} />} />
          <Route path="/refill" element={<div className="card"><h2>රීෆිල් පිටුව</h2></div>} />
        </Routes>
      </div>

    </div>
  );
}

function App() {
  return <Router><AppContent /></Router>;
}

export default App;