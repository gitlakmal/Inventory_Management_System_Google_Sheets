// src/pages/Distribute.jsx
import React, { useEffect, useState } from 'react';
import { fetchSheetData, postSheetData } from '../api';

const Distribute = ({ currentCategory, searchQuery }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadData();
  }, [currentCategory]);

  const loadData = async () => {
    setLoading(true);
    // getDistribute action එක හරහා දත්ත ගෙන්වා ගැනීම
    const response = await fetchSheetData('getDistribute', currentCategory);
    if (response.success) {
      setData(response.data);
    }
    setLoading(false);
  };

  // --- දත්ත මකා දැමීම (DELETE) ---
  const handleDelete = async (rowNum, catKey) => {
    if (!window.confirm("මෙම බෙදාදීමේ වාර්තාව මකා දැමීමට අවශ්‍ය බව විශ්වාසද? මෙවිට ප්‍රධාන ගබඩාවේ තොගය නැවත එකතු වනු ඇත.")) {
      return;
    }
    setSubmitting(true);
    const response = await postSheetData('deleteDistItem', { rowNum, catKey });
    
    if (response.success) {
      alert("🗑️ " + response.message);
      loadData();
    } else { alert("❌ දෝෂයක්: " + response.message); }
    setSubmitting(false);
  };

  // --- දත්ත වෙනස් කිරීම (EDIT) ---
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = {
      selectedCategory: editData.catKey,
      rowNum: editData.rowNum,
      pageNum: editData.pageNum,
      date: editData.date,
      time: editData.time,
      serialNo: editData.serialNo,
      itemName: editData.itemName,
      ward: editData.ward,
      person: editData.person,
      qty: Number(editData.qty)
    };

    const response = await postSheetData('updateDistItem', payload);
    
    if (response.success) {
      alert("✏️ " + response.message);
      setShowEditModal(false);
      loadData();
    } else { alert("❌ දෝෂයක්: " + response.message); }
    setSubmitting(false);
  };

  const openEdit = (item) => {
    setEditData({ ...item });
    setShowEditModal(true);
  };

  // Search Filter (දින, නම, වාට්ටුව හෝ අ.අ අනුව සෙවීම)
  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(searchLower) ||
      item.ward.toLowerCase().includes(searchLower) ||
      item.person.toLowerCase().includes(searchLower) ||
      item.date.includes(searchLower) ||
      item.serialNo.toString().includes(searchLower)
    );
  });

  return (
    <div className="card">
      <div className="header-flex">
        <h2>📤 බෙදාදීම් (Issue) වාර්තා</h2>
        <div className="controls-group">
           <button className="btn-secondary" onClick={loadData}>🔄 Refresh</button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">වාර්තා ගෙන්වමින් පවතී... ⏳</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>දිනය</th>
                <th>වේලාව</th>
                <th>අ.අ</th>
                <th>ද්‍රව්‍ය</th>
                <th>වාට්ටුව/අංශය</th>
                <th>ලබාගත් අය</th>
                <th>ප්‍රමාණය</th>
                <th style={{ textAlign: 'center' }}>ක්‍රියා</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan="8" style={{textAlign: 'center', padding: '30px'}}>වාර්තා කිසිවක් හමුවූයේ නැත.</td></tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.date}</td>
                    <td>{item.time}</td>
                    <td>{item.serialNo}</td>
                    <td style={{fontWeight: '500'}}>{item.itemName}</td>
                    <td style={{color: '#0ea5e9', fontWeight: 'bold'}}>{item.ward}</td>
                    <td>{item.person}</td>
                    <td><span className="qty-low">{item.qty}</span></td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => openEdit(item)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', marginRight: '6px', cursor: 'pointer' }}>
                        Edit ✏️
                      </button>
                      <button onClick={() => handleDelete(item.rowNum, item.catKey)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}>
                        Del 🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {showEditModal && editData && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header" style={{ borderBottomColor: '#f59e0b' }}>
              <h3 style={{ color: '#f59e0b' }}>✏️ බෙදාදීමේ වාර්තාව වෙනස් කරන්න</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>✖</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>දිනය</label>
                    <input type="date" className="input-field" required value={editData.date} onChange={(e) => setEditData({...editData, date: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>වේලාව</label>
                    <input type="time" className="input-field" required value={editData.time} onChange={(e) => setEditData({...editData, time: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label>ද්‍රව්‍ය නාමය (වෙනස් කළ නොහැක)</label>
                  <input type="text" className="input-field" disabled style={{ backgroundColor: '#e2e8f0' }} value={editData.itemName} />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>වාට්ටුව / අංශය</label>
                    <input type="text" className="input-field" required value={editData.ward} onChange={(e) => setEditData({...editData, ward: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>ලබාගත් අය</label>
                    <input type="text" className="input-field" required value={editData.person} onChange={(e) => setEditData({...editData, person: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ color: '#ef4444' }}>නිකුත් කළ ප්‍රමාණය</label>
                  <input type="number" className="input-field" required style={{ borderColor: '#ef4444' }} value={editData.qty} onChange={(e) => setEditData({...editData, qty: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>අවලංගු කරන්න</button>
                <button type="submit" className="btn-success" style={{ backgroundColor: '#f59e0b' }} disabled={submitting}>
                  {submitting ? "Processing..." : "යාවත්කාලීන කරන්න"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Distribute;