// src/components/Navigation.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Navigation = ({ currentCategory, onCategoryChange }) => {
  const location = useLocation();
  const isInventoryPage = location.pathname === '/';

  const categories = [
    { id: 'inventory', label: 'සියලුම දත්ත' },
    { id: 'lipi', label: '📝 ලිපි ද්‍රව්‍ය' },
    { id: 'viduli', label: '💡 විදුලි භාණ්ඩ' },
    { id: 'jala', label: '🚰 ජල නඩත්තු' },
    { id: 'thoga', label: '📦 තොග භාණ්ඩ' },
    { id: 'pari', label: '🛍️ පාරිභෝජන භාණ්ඩ' },
    { id: 'podu', label: '🏢 පොදු භාණ්ඩ' }
  ];

  return (
    <div className="top-nav" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '15px' }}>
      
      {/* Top Row: Search & Profile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        
        <div className="nav-actions">
          <button className="icon-btn" title="නිවේදන">🔔</button>
          <button className="icon-btn" title="සැකසුම්">⚙️</button>
          
          <div className="user-profile">
            <div className="user-avatar">A</div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">System Manager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Categories (Only visible on Inventory Page) */}
      {isInventoryPage && (
        <div className="nav-categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-chip ${currentCategory === cat.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default Navigation;