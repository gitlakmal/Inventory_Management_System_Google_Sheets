import React, { useEffect, useState } from 'react';
import { fetchSheetData, postSheetData } from '../api';

// Props විදිහට currentCategory එක ලබාගන්නවා
const Inventory = ({ currentCategory }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State Variables
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newItem, setNewItem] = useState({
    selectedCategory: '',
    serialNo: '',
    pageNum: '',
    itemName: '',
    totalQty: ''
  });

  // category වෙනුවට currentCategory භාවිතා කරනවා
  useEffect(() => {
    loadData();
  }, [currentCategory]); 

  const loadData = async () => {
    setLoading(true);
    const response = await fetchSheetData('getInventory', currentCategory);
    if (response.success) setData(response.data);
    setLoading(false);
  };

  // Form Submit කිරීම
  const handleAddItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // ඇතුළත් කරන දත්ත සකස් කිරීම
    const payload = {
      ...newItem,
      totalQty: Number(newItem.totalQty),
      issuedQty: 0, // අලුතින් දාද්දි බෙදාදුන් ගණන 0යි
      currentQty: Number(newItem.totalQty) // මුලු ගණනම ගබඩාවේ ඇත
    };

    const response = await postSheetData('addItem', payload);
    
    if (response.success) {
      alert("✅ භාණ්ඩය සාර්ථකව ඇතුළත් කරන ලදී!");
      setShowAddModal(false); // Modal එක වැසීම
      setNewItem({ selectedCategory: '', serialNo: '', pageNum: '', itemName: '', totalQty: '' }); // Form එක හිස් කිරීම
      loadData(); // දත්ත නැවත Refresh කිරීම
    } else {
      alert("❌ දෝෂයක්: " + response.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="card">
      <div className="header-flex">
        <h2>📦 භාණ්ඩ ලේඛනය</h2>
        
        <div className="controls-group">
          {/* පැරණි Select එක මෙතනින් සම්පූර්ණයෙන්ම ඉවත් කර ඇත */}
          
          {/* Add Item Button */}
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            ➕ නව භාණ්ඩයක්
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">දත්ත ගෙන්වමින් පවතී... ⏳</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>අ.අ</th>
              <th>පිටු අංකය</th>
              <th>ද්‍රව්‍ය</th>
              <th>කාණ්ඩය</th>
              <th>ගබඩාවේ ප්‍රමාණය</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>දත්ත කිසිවක් හමුවූයේ නැත.</td></tr>
            ) : (
              data.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.serialNo}</td>
                  <td>{item.pageNum}</td>
                  <td style={{fontWeight: '500'}}>{item.itemName}</td>
                  <td><span className="category-badge">{item.categoryName}</span></td>
                  <td>
                    <span className={item.currentQty <= 5 ? 'qty-low' : 'qty-good'}>
                      {item.currentQty}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* --- ADD ITEM MODAL --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>නව භාණ්ඩයක් ඇතුළත් කරන්න</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✖</button>
            </div>
            
            <form onSubmit={handleAddItem}>
              <div className="modal-body">
                <div className="form-group">
                  <label>කාණ්ඩය තෝරන්න (Category)</label>
                  <select 
                    className="input-field" required
                    value={newItem.selectedCategory}
                    onChange={(e) => setNewItem({...newItem, selectedCategory: e.target.value})}
                  >
                    <option value="" disabled>-- තෝරන්න --</option>
                    <option value="lipi">ලිපි ද්‍රව්‍ය</option>
                    <option value="viduli">විදුලි භාණ්ඩ</option>
                    <option value="jala">ජල නඩත්තු</option>
                    <option value="thoga">තොග භාණ්ඩ</option>
                    <option value="pari">පාරිභෝජන භාණ්ඩ</option>
                    <option value="podu">පොදු භාණ්ඩ</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>පිටු අංකය (Page)</label>
                    <input type="text" className="input-field" required
                      value={newItem.pageNum}
                      onChange={(e) => setNewItem({...newItem, pageNum: e.target.value})}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>අ.අ (Serial No)</label>
                    <input type="number" className="input-field" required
                      value={newItem.serialNo}
                      onChange={(e) => setNewItem({...newItem, serialNo: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>ද්‍රව්‍ය නාමය (Item Name)</label>
                  <input type="text" className="input-field" required
                    value={newItem.itemName}
                    onChange={(e) => setNewItem({...newItem, itemName: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>මුලු ප්‍රමාණය (Total Qty)</label>
                  <input type="number" className="input-field" required
                    value={newItem.totalQty}
                    onChange={(e) => setNewItem({...newItem, totalQty: e.target.value})}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  අවලංගු කරන්න
                </button>
                <button type="submit" className="btn-success" disabled={submitting}>
                  {submitting ? "ඇතුළත් කරමින් පවතී..." : "දත්ත ඇතුළත් කරන්න"}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;