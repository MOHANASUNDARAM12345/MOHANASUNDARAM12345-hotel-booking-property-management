import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, Hotel, Star, MapPin } from 'lucide-react';

export const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [user]);

  const fetchFavorites = () => {
    setLoading(true);
    api.getFavoritesByUser(user.userId)
      .then(async favs => {
        if (!Array.isArray(favs)) {
          setFavorites([]);
          return;
        }
        // Fetch details for each favorite hotel
        const fullFavs = await Promise.all(
          favs.map(async f => {
            try {
              const hotel = await api.getHotelById(f.hotelId);
              return { ...f, hotel };
            } catch {
              return f;
            }
          })
        );
        setFavorites(fullFavs);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleRemove = async (hotelId) => {
    try {
      await api.removeFavorite(user.userId, hotelId);
      setFavorites(favorites.filter(f => f.hotelId !== hotelId));
    } catch (err) {
      alert(err.message || 'Failed to remove favorite');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>My Saved Favorites</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Quick access to your saved hotels and luxury stays</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <Heart size={48} color="#f43f5e" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Favorites Saved Yet</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Browse hotels and click "Add Favorite" to save them here.</p>
          <Link to="/hotels" style={{ display: 'inline-block', marginTop: '1rem', background: '#4f46e5', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 600 }}>
            Browse Hotels
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {favorites.map(fav => (
            <div key={fav.favoriteId} style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)'
            }}>
              <div style={{ height: '170px', background: '#e2e8f0', position: 'relative' }}>
                <img
                  src={fav.hotel?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
                  alt={fav.hotel?.hotelName || 'Hotel'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => handleRemove(fav.hotelId)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: '#fee2e2',
                    color: '#ef4444',
                    border: 'none',
                    padding: '0.4rem',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>
                  {fav.hotel?.hotelName || `Hotel #${fav.hotelId}`}
                </h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <MapPin size={14} /> {fav.hotel?.location || 'City Center'}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{fav.hotel?.price || 2500}
                  </span>
                  <Link to={`/hotels/${fav.hotelId}`} style={{
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
