// src/components/Navigation.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Navigation = ({ currentCategory, onCategoryChange, searchQuery, onSearchChange }) => {
  const location = useLocation();
  const isInventoryPage = location.pathname === '/';
  
  // Profile Dropdown එක පාලනය කිරීම සඳහා State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Dropdown එකෙන් එළියට ක්ලික් කළ විට එය වැසී යාමට
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div className="top-nav" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      
      {/* --- වම්පස කොටස: Hospital Icon සහ Categories --- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, overflowX: 'auto' }}>
        <div style={{ fontSize: '28px', cursor: 'pointer' }} title="Hospital Store">🏥</div>
        
        {isInventoryPage && (
          <div className="nav-categories" style={{ display: 'flex', gap: '10px', paddingBottom: '0', margin: '0' }}>
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

      {/* --- දකුණුපස කොටස: Search, Notifications සහ Profile --- */}
      <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '20px' }}>
        
        

        <button className="icon-btn" title="නිවේදන">🔔</button>
        
        {/* Profile සහ Dropdown */}
        <div className="profile-container" ref={dropdownRef} style={{ position: 'relative' }}>
          
          <div 
            className="user-profile" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{ cursor: 'pointer', paddingRight: '10px' }}
          >
            <div className="user-avatar">A</div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">System Manager</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>▼</span>
          </div>

          {/* Dropdown Menu එක */}
          {isProfileOpen && (
            <div className="profile-dropdown">
              <ul>
                <li>Accessibility</li>
                <li>Profile</li>
                <li>Calendar</li>
                <li>Reports</li>
                <li>Preferences</li>
                <hr />
                <li className="logout">Log out</li>
              </ul>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default Navigation;