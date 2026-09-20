import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Search, MapPin, Star, ShieldCheck, Sparkles, Building, Calendar, ArrowRight } from 'lucide-react';

export const Home = () => {
  const [hotels, setHotels] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getHotels()
      .then(data => {
        setHotels(Array.isArray(data) ? data.slice(0, 6) : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/hotels?city=${encodeURIComponent(searchCity)}`);
    } else {
      navigate('/hotels');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: 'white',
        padding: '5rem 0 6rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.4rem 1rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            <Sparkles size={16} color="#fbbf24" /> Next-Gen Capstone Hotel Management System
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: '1.2', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Book Premium Stays & Manage Properties Effortlessly
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '680px', margin: '0 auto 2.5rem auto' }}>
            Discover handpicked hotels, luxury resorts, and boutique stays. Complete end-to-end booking, payments, and property owner management.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            background: 'white',
            padding: '0.6rem',
            borderRadius: '16px',
            maxWidth: '750px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
            color: '#1e293b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, padding: '0 1rem' }}>
              <MapPin size={20} color="#4f46e5" />
              <input
                type="text"
                placeholder="Where do you want to stay? (e.g. Mumbai, Goa, Delhi)"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                style={{
                  border: 'none',
                  width: '100%',
                  fontSize: '0.95rem',
                  color: '#1e293b',
                  background: 'transparent'
                }}
              />
            </div>
            <button type="submit" style={{
              background: '#4f46e5',
              color: 'white',
              padding: '0.85rem 1.75rem',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Search size={18} /> Search Hotels
            </button>
          </form>
        </div>
      </div>

      {/* Feature Badges */}
      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { icon: <Building size={24} color="#4f46e5" />, title: 'Property Management', desc: 'Manage properties, rooms, staff & pricing.' },
            { icon: <Calendar size={24} color="#0ea5e9" />, title: 'Real-time Booking', desc: 'Instant confirmation with zero double booking.' },
            { icon: <ShieldCheck size={24} color="#10b981" />, title: 'Secure Payments', desc: 'BCrypt security & masked transaction safety.' },
          ].map((feat, idx) => (
            <div key={idx} style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '16px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>{feat.icon}</div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{feat.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Hotels */}
      <div className="container" style={{ padding: '5rem 1.5rem 3rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>Featured Stays & Hotels</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>Handpicked top-rated accommodations for your next trip</p>
          </div>
          <Link to="/hotels" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#4f46e5', fontWeight: 700 }}>
            View All Hotels <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading featured hotels...</div>
        ) : hotels.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'white',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1'
          }}>
            <Building size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Hotels Found</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Be the first property owner to register a hotel!</p>
            <Link to="/login" style={{
              display: 'inline-block',
              marginTop: '1rem',
              background: '#4f46e5',
              color: 'white',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600
            }}>
              Owner Login
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {hotels.map(hotel => (
              <div key={hotel.hotelId} style={{
                background: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}>
                <div style={{ height: '180px', background: '#e2e8f0', position: 'relative' }}>
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
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    {hotel.category || 'Luxury Stay'}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {hotel.hotelName}
                  </h3>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <MapPin size={14} /> {hotel.location || 'City Center'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>₹{hotel.price || 2500}</span>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}> / night</span>
                    </div>
                    <Link to={`/hotels/${hotel.hotelId}`} style={{
                      background: '#eef2ff',
                      color: '#4f46e5',
                      padding: '0.45rem 0.9rem',
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
    </div>
  );
};
