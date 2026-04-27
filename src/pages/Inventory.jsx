import React, { useEffect, useState } from 'react';
import { fetchSheetData, postSheetData } from '../api';

const Inventory = ({ currentCategory, searchQuery }) => {
  const [data, setData] = useState([]);
  const [wards, setWards] = useState([]); // වාට්ටු ලැයිස්තුව සඳහා
  const [loading, setLoading] = useState(true);
  
  // Modals පාලනය කිරීම සඳහා States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // තෝරාගත් භාණ්ඩය

  // Form Data States
  const [newItem, setNewItem] = useState({ selectedCategory: '', serialNo: '', pageNum: '', itemName: '', totalQty: '' });
  const [issueData, setIssueData] = useState({ wardSelect: '', newWard: '', personName: '', issueQtyInput: '' });
  const [refillData, setRefillData] = useState({ refillQtyInput: '', refillNote: '' });

  useEffect(() => {
    loadData();
    loadWards();
  }, [currentCategory]); 

  // 1. දත්ත ගෙන්වා ගැනීම
  const loadData = async () => {
    setLoading(true);
    const response = await fetchSheetData('getInventory', currentCategory);
    if (response.success) setData(response.data);
    setLoading(false);
  };

  // 2. වාට්ටු ලැයිස්තුව ගෙන්වා ගැනීම
  const loadWards = async () => {
    const response = await fetchSheetData('getWards', currentCategory);
    if (response.success) setWards(response.data);
  };

  // --- අලුත් භාණ්ඩයක් ඇතුළත් කිරීම ---
  const handleAddItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...newItem, totalQty: Number(newItem.totalQty), issuedQty: 0, currentQty: Number(newItem.totalQty) };
    const response = await postSheetData('addItem', payload);
    
    if (response.success) {
      alert("✅ " + response.message);
      setShowAddModal(false);
      setNewItem({ selectedCategory: '', serialNo: '', pageNum: '', itemName: '', totalQty: '' });
      loadData();
    } else { alert("❌ දෝෂයක්: " + response.message); }
    setSubmitting(false);
  };

  // --- භාණ්ඩ නිකුත් කිරීම (Issue) ---
  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = {
      issueCategory: selectedItem.catKey,
      issueRowNum: selectedItem.rowNum,
      issueSerial: selectedItem.serialNo,
      issuePage: selectedItem.pageNum,
      issueItemName: selectedItem.itemName,
      wardSelect: issueData.wardSelect,
      newWard: issueData.newWard,
      personName: issueData.personName,
      issueQtyInput: issueData.issueQtyInput
    };

    const response = await postSheetData('issueItem', payload);
    
    if (response.success) {
      alert("📤 " + response.message);
      setShowIssueModal(false);
      loadData();
      loadWards(); // අලුත් වාට්ටුවක් දැම්මොත් ඒකත් ලෝඩ් වෙන්න
    } else { alert("❌ දෝෂයක්: " + response.message); }
    setSubmitting(false);
  };

  // --- තොග නැවත පිරවීම (Refill) ---
  const handleRefillSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const payload = {
      refillCategory: selectedItem.catKey,
      refillRowNum: selectedItem.rowNum,
      refillSerial: selectedItem.serialNo,
      refillPage: selectedItem.pageNum,
      refillItemName: selectedItem.itemName,
      refillQtyInput: refillData.refillQtyInput,
      refillNote: refillData.refillNote
    };

    const response = await postSheetData('refillItem', payload);
    
    if (response.success) {
      alert("📥 " + response.message);
      setShowRefillModal(false);
      loadData();
    } else { alert("❌ දෝෂයක්: " + response.message); }
    setSubmitting(false);
  };

  // Modal විවෘත කරන Functions
  const openIssue = (item) => {
    setSelectedItem(item);
    setIssueData({ wardSelect: '', newWard: '', personName: '', issueQtyInput: '' });
    setShowIssueModal(true);
  };

  const openRefill = (item) => {
    setSelectedItem(item);
    setRefillData({ refillQtyInput: '', refillNote: '' });
    setShowRefillModal(true);
  };

  // Search Filter
  const filteredData = data.filter(item => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      item.itemName.toLowerCase().includes(searchLower) ||
      item.serialNo.toString().includes(searchLower) ||
      item.pageNum.toString().includes(searchLower)
    );
  });

  return (
    <div className="card">
      <div className="header-flex">
        <h2>📦 භාණ්ඩ ලේඛනය</h2>
        <div className="controls-group">
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            ➕ නව භාණ්ඩයක්
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">දත්ත ගෙන්වමින් පවතී... ⏳</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>අ.අ</th>
                <th>පිටු අංකය</th>
                <th>ද්‍රව්‍ය</th>
                <th>කාණ්ඩය</th>
                <th>ගබඩාවේ ප්‍රමාණය</th>
                <th style={{ textAlign: 'center' }}>ක්‍රියා (Actions)</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '30px'}}>දත්ත කිසිවක් හමුවූයේ නැත.</td></tr>
              ) : (
                filteredData.map((item, idx) => (
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
                    <td style={{ textAlign: 'center' }}>
                      {/* අලුත් Issue සහ Refill බොත්තම් */}
                      <button 
                        onClick={() => openIssue(item)}
                        style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', marginRight: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Issue 📤
                      </button>
                      <button 
                        onClick={() => openRefill(item)}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        Refill ➕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADD ITEM MODAL --- (කලින් තිබූ ආකාරයටම) */}
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
                  <select className="input-field" required value={newItem.selectedCategory} onChange={(e) => setNewItem({...newItem, selectedCategory: e.target.value})}>
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
                    <input type="text" className="input-field" required value={newItem.pageNum} onChange={(e) => setNewItem({...newItem, pageNum: e.target.value})} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>අ.අ (Serial No)</label>
                    <input type="number" className="input-field" required value={newItem.serialNo} onChange={(e) => setNewItem({...newItem, serialNo: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>ද්‍රව්‍ය නාමය (Item Name)</label>
                  <input type="text" className="input-field" required value={newItem.itemName} onChange={(e) => setNewItem({...newItem, itemName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>මුලු ප්‍රමාණය (Total Qty)</label>
                  <input type="number" className="input-field" required value={newItem.totalQty} onChange={(e) => setNewItem({...newItem, totalQty: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>අවලංගු කරන්න</button>
                <button type="submit" className="btn-success" disabled={submitting}>{submitting ? "Processing..." : "දත්ත ඇතුළත් කරන්න"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ISSUE MODAL (භාණ්ඩ බෙදාදීම) --- */}
      {showIssueModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header" style={{ borderBottomColor: '#0ea5e9' }}>
              <h3 style={{ color: '#0ea5e9' }}>📤 භාණ්ඩ බෙදාදීම</h3>
              <button className="close-btn" onClick={() => setShowIssueModal(false)}>✖</button>
            </div>
            <form onSubmit={handleIssueSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label style={{ color: '#0ea5e9' }}>ද්‍රව්‍ය නාමය:</label>
                  <input type="text" className="input-field" style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold' }} readOnly value={selectedItem.itemName} />
                </div>
                <div className="form-group">
                  <label>වාට්ටුව / අංශය තෝරන්න</label>
                  <select className="input-field" required value={issueData.wardSelect} onChange={(e) => setIssueData({...issueData, wardSelect: e.target.value})}>
                    <option value="" disabled>-- තෝරන්න --</option>
                    {wards.map((w, i) => <option key={i} value={w}>{w}</option>)}
                    <option value="NEW" style={{ color: '#10b981', fontWeight: 'bold' }}>+ අලුත් වාට්ටුවක්/අංශයක්</option>
                  </select>
                </div>
                {issueData.wardSelect === 'NEW' && (
                  <div className="form-group">
                    <input type="text" className="input-field" style={{ borderColor: '#10b981' }} placeholder="අලුත් නම මෙතන ගහන්න" required value={issueData.newWard} onChange={(e) => setIssueData({...issueData, newWard: e.target.value})} />
                  </div>
                )}
                <div className="form-group">
                  <label>රැගෙන යන අයගේ නම</label>
                  <input type="text" className="input-field" required value={issueData.personName} onChange={(e) => setIssueData({...issueData, personName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label style={{ color: '#ef4444' }}>බෙදාදෙන ප්‍රමාණය (Available: {selectedItem.currentQty})</label>
                  <input type="number" className="input-field" style={{ borderColor: '#ef4444' }} required max={selectedItem.currentQty} value={issueData.issueQtyInput} onChange={(e) => setIssueData({...issueData, issueQtyInput: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowIssueModal(false)}>අවලංගු කරන්න</button>
                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Processing..." : "තහවුරු කරන්න"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REFILL MODAL (ගබඩාව නැවත පිරවීම) --- */}
      {showRefillModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header" style={{ borderBottomColor: '#10b981' }}>
              <h3 style={{ color: '#10b981' }}>➕ ගබඩාව නැවත පිරවීම</h3>
              <button className="close-btn" onClick={() => setShowRefillModal(false)}>✖</button>
            </div>
            <form onSubmit={handleRefillSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label style={{ color: '#0ea5e9' }}>ද්‍රව්‍ය නාමය:</label>
                  <input type="text" className="input-field" style={{ backgroundColor: '#f1f5f9', fontWeight: 'bold' }} readOnly value={selectedItem.itemName} />
                </div>
                <div className="form-group">
                  <label style={{ color: '#10b981' }}>අලුතින් ගෙනා ප්‍රමාණය:</label>
                  <input type="number" className="input-field" style={{ borderColor: '#10b981' }} required value={refillData.refillQtyInput} onChange={(e) => setRefillData({...refillData, refillQtyInput: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>සටහන / බිල්පත් අංකය (විකල්ප):</label>
                  <input type="text" className="input-field" placeholder="අවශ්‍ය නම් පමණක් යොදන්න" value={refillData.refillNote} onChange={(e) => setRefillData({...refillData, refillNote: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setShowRefillModal(false)}>අවලංගු කරන්න</button>
                <button type="submit" className="btn-success" disabled={submitting}>{submitting ? "Processing..." : "තොගය යාවත්කාලීන කරන්න"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;