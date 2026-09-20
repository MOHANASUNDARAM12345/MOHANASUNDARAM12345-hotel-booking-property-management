import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Search, MapPin, Star, Building2, Filter } from 'lucide-react';

export const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('city') || '');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    api.getHotels()
      .then(data => setHotels(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredHotels = hotels.filter(h => {
    const matchesSearch = !searchTerm ||
      (h.hotelName && h.hotelName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (h.location && h.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || (h.category && h.category.toUpperCase() === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Browse Hotels & Resorts</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Explore top property stays, compare rates and amenities</p>
      </div>

      {/* Filter and Search controls */}
      <div style={{
        background: 'white',
        padding: '1.25rem',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2.5rem'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by hotel name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.65rem 0.65rem 2.4rem',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Filter size={16} /> Category:
          </span>
          {['ALL', 'LUXURY', 'RESORT', 'BUDGET', 'BOUTIQUE'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: selectedCategory === cat ? '#4f46e5' : '#f1f5f9',
                color: selectedCategory === cat ? 'white' : '#475569'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading hotels catalog...</div>
      ) : filteredHotels.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'white',
          borderRadius: '16px',
          border: '1px dashed #cbd5e1'
        }}>
          <Building2 size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Hotels Match Your Criteria</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Try adjusting your search location or category filter.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {filteredHotels.map(hotel => (
            <div key={hotel.hotelId} style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ height: '190px', background: '#e2e8f0', position: 'relative' }}>
                <img
                  src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
                  alt={hotel.hotelName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(4px)',
                  color: '#fbbf24',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Star size={14} fill="#fbbf24" /> {hotel.rating || 4.5}
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {hotel.category || 'Luxury Stay'}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {hotel.hotelName}
                  </h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <MapPin size={14} /> {hotel.location || 'City Center'}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {hotel.description || 'Experience comfort and hospitality with modern amenities and scenic views.'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>₹{hotel.price || 2500}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}> / night</span>
                  </div>
                  <Link to={`/hotels/${hotel.hotelId}`} style={{
                    background: '#4f46e5',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
