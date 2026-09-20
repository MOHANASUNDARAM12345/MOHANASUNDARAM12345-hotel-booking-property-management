import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, FileText, XCircle, AlertCircle, CheckCircle } from 'lucide-react';

export const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = () => {
    setLoading(true);
    api.getBookingsByUser(user.userId)
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.cancelBooking(bookingId);
        fetchBookings();
      } catch (err) {
        alert(err.message || 'Error cancelling booking');
      }
    }
  };

  const filteredBookings = bookings.filter(b => filterStatus === 'ALL' || b.status === filterStatus);

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>My Reservations</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Track check-in dates, payments, and invoices</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: filterStatus === st ? '#4f46e5' : 'white',
                color: filterStatus === st ? 'white' : '#475569',
                border: '1px solid #cbd5e1'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading your reservations...</div>
      ) : filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <Calendar size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Bookings Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Browse hotels to plan your next stay!</p>
          <Link to="/hotels" style={{ display: 'inline-block', marginTop: '1rem', background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600 }}>
            Browse Hotels
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredBookings.map(b => (
            <div key={b.bookingId} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    Booking #{b.bookingId}
                  </span>
                  <span className={`badge badge-${(b.status || 'pending').toLowerCase()}`}>
                    {b.status || 'PENDING'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', color: '#475569', fontSize: '0.9rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Room Number</div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>Room #{b.roomId}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Check In</div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{b.checkInDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Check Out</div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{b.checkOutDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Guests</div>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{b.guests} Person(s)</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Price</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#4f46e5' }}>₹{b.totalAmount || 0}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {b.status === 'PENDING' && (
                    <button
                      onClick={() => navigate(`/payment?bookingId=${b.bookingId}&amount=${b.totalAmount}`)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '0.55rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <CreditCard size={16} /> Pay Now
                    </button>
                  )}

                  {(b.status === 'CONFIRMED' || b.status === 'COMPLETED') && (
                    <button
                      onClick={() => navigate(`/invoice?bookingId=${b.bookingId}`)}
                      style={{
                        background: '#eef2ff',
                        color: '#4f46e5',
                        padding: '0.55rem 1.25rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      <FileText size={16} /> View Invoice
                    </button>
                  )}

                  {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                    <button
                      onClick={() => handleCancelBooking(b.bookingId)}
                      style={{
                        background: '#fef2f2',
                        color: '#ef4444',
                        padding: '0.45rem 1rem',
                        borderRadius: '8px',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
