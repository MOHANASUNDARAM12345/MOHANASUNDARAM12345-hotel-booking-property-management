import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { BedDouble, Users, Hotel, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRooms()
      .then(data => setRooms(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>All Rooms Catalog</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Find individual suite rooms, deluxe spaces, and family accommodations</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading available rooms...</div>
      ) : rooms.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <BedDouble size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Rooms Available</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {rooms.map(room => (
            <div key={room.roomId} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>Room {room.roomNumber}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600 }}>{room.roomType || 'Standard Room'}</div>
                </div>
                <span style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  background: room.status === 'AVAILABLE' || !room.status ? '#d1fae5' : '#fef3c7',
                  color: room.status === 'AVAILABLE' || !room.status ? '#047857' : '#b45309'
                }}>
                  {room.status || 'AVAILABLE'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Users size={16} /> Max {room.capacity || 2} Guests</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Hotel size={16} /> Hotel #{room.hotelId}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>₹{room.price || 1500}</span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}> / night</span>
                </div>
                <Link to={`/hotels/${room.hotelId}`} style={{
                  background: '#4f46e5',
                  color: 'white',
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  View Hotel
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
