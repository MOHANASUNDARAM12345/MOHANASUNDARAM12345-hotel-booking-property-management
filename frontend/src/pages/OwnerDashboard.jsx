import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ShieldCheck, Building, Hotel as HotelIcon, BedDouble, Users, Tag, Plus, Trash2, Edit3, Sparkles } from 'lucide-react';

export const OwnerDashboard = () => {
  const { user, isOwner } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('PROPERTIES');
  const [properties, setProperties] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modals
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);

  // Form Fields
  const [propForm, setPropForm] = useState({ propertyName: '', propertyType: 'Hotel', city: '', address: '', description: '' });
  const [hotelForm, setHotelForm] = useState({ propertyId: '', hotelName: '', location: '', category: 'LUXURY', price: 2500, description: '', imageUrl: '' });
  const [roomForm, setRoomForm] = useState({ hotelId: '', roomNumber: '', roomType: 'Deluxe', price: 2000, capacity: 2, status: 'AVAILABLE' });
  const [staffForm, setStaffForm] = useState({ hotelId: '', name: '', role: 'Manager', phone: '', email: '' });
  const [couponForm, setCouponForm] = useState({ code: '', discountPercentage: 10, maxDiscount: 500, minBookingAmount: 1000 });

  useEffect(() => {
    if (!user || !isOwner) {
      alert('Access Restricted. OWNER role required.');
      navigate('/login');
      return;
    }
    loadData();
  }, [user, isOwner]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pData, hData, rData, cData, sData] = await Promise.all([
        api.getProperties().catch(() => []),
        api.getHotels().catch(() => []),
        api.getRooms().catch(() => []),
        api.getCoupons().catch(() => []),
        api.getServicesByHotel(1).catch(() => []),
      ]);
      setProperties(Array.isArray(pData) ? pData : []);
      setHotels(Array.isArray(hData) ? hData : []);
      setRooms(Array.isArray(rData) ? rData : []);
      setCoupons(Array.isArray(cData) ? cData : []);
      setServices(Array.isArray(sData) ? sData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    try {
      await api.createProperty({ ...propForm, ownerId: user.userId || 1 });
      setShowPropertyModal(false);
      setPropForm({ propertyName: '', propertyType: 'Hotel', city: '', address: '', description: '' });
      loadData();
    } catch (err) {
      alert(err.message || 'Error creating property');
    }
  };

  const handleCreateHotel = async (e) => {
    e.preventDefault();
    try {
      await api.createHotel({ ...hotelForm, propertyId: parseInt(hotelForm.propertyId || (properties[0]?.propertyId || 1)) });
      setShowHotelModal(false);
      setHotelForm({ propertyId: '', hotelName: '', location: '', category: 'LUXURY', price: 2500, description: '', imageUrl: '' });
      loadData();
    } catch (err) {
      alert(err.message || 'Error creating hotel');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      await api.createRoom({ ...roomForm, hotelId: parseInt(roomForm.hotelId || (hotels[0]?.hotelId || 1)) });
      setShowRoomModal(false);
      setRoomForm({ hotelId: '', roomNumber: '', roomType: 'Deluxe', price: 2000, capacity: 2, status: 'AVAILABLE' });
      loadData();
    } catch (err) {
      alert(err.message || 'Error creating room');
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      await api.createStaff({ ...staffForm, hotelId: parseInt(staffForm.hotelId || (hotels[0]?.hotelId || 1)) });
      setShowStaffModal(false);
      setStaffForm({ hotelId: '', name: '', role: 'Manager', phone: '', email: '' });
      loadData();
    } catch (err) {
      alert(err.message || 'Error creating staff member');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.createCoupon({ ...couponForm, isActive: true });
      setShowCouponModal(false);
      setCouponForm({ code: '', discountPercentage: 10, maxDiscount: 500, minBookingAmount: 1000 });
      loadData();
    } catch (err) {
      alert(err.message || 'Error creating coupon');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Delete this property?')) {
      await api.deleteProperty(id);
      loadData();
    }
  };

  const handleDeleteHotel = async (id) => {
    if (window.confirm('Delete this hotel?')) {
      await api.deleteHotel(id);
      loadData();
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Delete this room?')) {
      await api.deleteRoom(id);
      loadData();
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Delete coupon?')) {
      await api.deleteCoupon(id);
      loadData();
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#f3e8ff', color: '#7e22ce', padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            <ShieldCheck size={16} /> OWNER Management Portal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Property Owner Control Panel</h1>
        </div>

        {/* Stats Pills */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'white', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Properties</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f46e5' }}>{properties.length}</div>
          </div>
          <div style={{ background: 'white', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Hotels</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0ea5e9' }}>{hotels.length}</div>
          </div>
          <div style={{ background: 'white', padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Rooms</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{rooms.length}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
        {[
          { id: 'PROPERTIES', label: 'Properties', icon: <Building size={18} /> },
          { id: 'HOTELS', label: 'Hotels', icon: <HotelIcon size={18} /> },
          { id: 'ROOMS', label: 'Rooms', icon: <BedDouble size={18} /> },
          { id: 'STAFF', label: 'Staff Members', icon: <Users size={18} /> },
          { id: 'COUPONS', label: 'Coupons', icon: <Tag size={18} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: activeTab === tab.id ? '#4f46e5' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading owner records...</div>
      ) : (
        <>
          {/* PROPERTIES TAB */}
          {activeTab === 'PROPERTIES' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Properties ({properties.length})</h3>
                <button
                  onClick={() => setShowPropertyModal(true)}
                  style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> Add Property
                </button>
              </div>

              {properties.length === 0 ? (
                <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                  <p style={{ color: '#64748b' }}>No properties registered yet. Click "Add Property" to create your first listing.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {properties.map(p => (
                    <div key={p.propertyId} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>{p.propertyName}</h4>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>{p.propertyType}</span>
                        </div>
                        <button onClick={() => handleDeleteProperty(p.propertyId)} style={{ background: '#fee2e2', color: '#ef4444', padding: '0.35rem', borderRadius: '6px' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>{p.city} • {p.address}</p>
                      <p style={{ fontSize: '0.85rem', color: '#475569' }}>{p.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* HOTELS TAB */}
          {activeTab === 'HOTELS' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Hotels ({hotels.length})</h3>
                <button
                  onClick={() => setShowHotelModal(true)}
                  style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> Add Hotel
                </button>
              </div>

              {hotels.length === 0 ? (
                <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', textAlign: 'center', border: '1px dashed #cbd5e1' }}>
                  <p style={{ color: '#64748b' }}>No hotels added yet.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {hotels.map(h => (
                    <div key={h.hotelId} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{h.hotelName}</h4>
                        <button onClick={() => handleDeleteHotel(h.hotelId)} style={{ background: '#fee2e2', color: '#ef4444', padding: '0.35rem', borderRadius: '6px' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>{h.location} • ₹{h.price}/night</p>
                      <span className="badge badge-completed">{h.category || 'LUXURY'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ROOMS TAB */}
          {activeTab === 'ROOMS' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Hotel Rooms ({rooms.length})</h3>
                <button
                  onClick={() => setShowRoomModal(true)}
                  style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> Add Room
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {rooms.map(r => (
                  <div key={r.roomId} style={{ background: 'white', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Room {r.roomNumber}</h4>
                      <button onClick={() => handleDeleteRoom(r.roomId)} style={{ background: '#fee2e2', color: '#ef4444', padding: '0.3rem', borderRadius: '6px' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{r.roomType || 'Standard'} • Max {r.capacity || 2} Guests</p>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginTop: '0.5rem' }}>₹{r.price || 1500} / night</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAFF TAB */}
          {activeTab === 'STAFF' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Hotel Staff Members</h3>
                <button
                  onClick={() => setShowStaffModal(true)}
                  style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> Add Staff Member
                </button>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Manage receptionist, housekeeping, and front desk personnel.</p>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'COUPONS' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Discount Coupons ({coupons.length})</h3>
                <button
                  onClick={() => setShowCouponModal(true)}
                  style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Plus size={16} /> Create Coupon
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {coupons.map(c => (
                  <div key={c.couponId} style={{ background: 'white', padding: '1.25rem', borderRadius: '14px', border: '1px dashed #4f46e5', position: 'relative' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '0.05em' }}>{c.code}</div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>{c.discountPercentage}% OFF (Max ₹{c.maxDiscount})</div>
                    <button onClick={() => handleDeleteCoupon(c.couponId)} style={{ position: 'absolute', top: '12px', right: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.3rem', borderRadius: '6px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* CREATE PROPERTY MODAL */}
      {showPropertyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Property</h3>
            <form onSubmit={handleCreateProperty} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" required placeholder="Property Name" value={propForm.propertyName} onChange={e => setPropForm({ ...propForm, propertyName: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" required placeholder="City" value={propForm.city} onChange={e => setPropForm({ ...propForm, city: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Address" value={propForm.address} onChange={e => setPropForm({ ...propForm, address: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <textarea placeholder="Description" value={propForm.description} onChange={e => setPropForm({ ...propForm, description: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowPropertyModal(false)} style={{ background: '#f1f5f9', padding: '0.6rem 1rem', borderRadius: '8px' }}>Cancel</button>
                <button type="submit" style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700 }}>Save Property</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE HOTEL MODAL */}
      {showHotelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Hotel</h3>
            <form onSubmit={handleCreateHotel} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select value={hotelForm.propertyId} onChange={e => setHotelForm({ ...hotelForm, propertyId: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <option value="">Select Associated Property</option>
                {properties.map(p => <option key={p.propertyId} value={p.propertyId}>{p.propertyName}</option>)}
              </select>
              <input type="text" required placeholder="Hotel Name" value={hotelForm.hotelName} onChange={e => setHotelForm({ ...hotelForm, hotelName: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" required placeholder="Location / City" value={hotelForm.location} onChange={e => setHotelForm({ ...hotelForm, location: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="number" required placeholder="Base Price / Night" value={hotelForm.price} onChange={e => setHotelForm({ ...hotelForm, price: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Image URL (optional)" value={hotelForm.imageUrl} onChange={e => setHotelForm({ ...hotelForm, imageUrl: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowHotelModal(false)} style={{ background: '#f1f5f9', padding: '0.6rem 1rem', borderRadius: '8px' }}>Cancel</button>
                <button type="submit" style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700 }}>Save Hotel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ROOM MODAL */}
      {showRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Add New Room</h3>
            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <select value={roomForm.hotelId} onChange={e => setRoomForm({ ...roomForm, hotelId: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <option value="">Select Hotel</option>
                {hotels.map(h => <option key={h.hotelId} value={h.hotelId}>{h.hotelName}</option>)}
              </select>
              <input type="text" required placeholder="Room Number (e.g. 101, 202)" value={roomForm.roomNumber} onChange={e => setRoomForm({ ...roomForm, roomNumber: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Room Type (Deluxe, Suite, Standard)" value={roomForm.roomType} onChange={e => setRoomForm({ ...roomForm, roomType: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="number" required placeholder="Price per Night" value={roomForm.price} onChange={e => setRoomForm({ ...roomForm, price: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowRoomModal(false)} style={{ background: '#f1f5f9', padding: '0.6rem 1rem', borderRadius: '8px' }}>Cancel</button>
                <button type="submit" style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700 }}>Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE COUPON MODAL */}
      {showCouponModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Create Coupon</h3>
            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" required placeholder="Coupon Code (e.g. STAY20)" value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="number" required placeholder="Discount Percentage (%)" value={couponForm.discountPercentage} onChange={e => setCouponForm({ ...couponForm, discountPercentage: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="number" placeholder="Max Discount Amount (₹)" value={couponForm.maxDiscount} onChange={e => setCouponForm({ ...couponForm, maxDiscount: e.target.value })} style={{ padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowCouponModal(false)} style={{ background: '#f1f5f9', padding: '0.6rem 1rem', borderRadius: '8px' }}>Cancel</button>
                <button type="submit" style={{ background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700 }}>Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
