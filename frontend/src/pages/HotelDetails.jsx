import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Star, Heart, Calendar, Users, ShieldCheck, MessageSquare, Check, Sparkles, Building } from 'lucide-react';

export const HotelDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getHotelById(id),
      api.getRoomsByHotel(id),
      api.getServicesByHotel(id).catch(() => []),
      api.getReviewsByHotel(id).catch(() => []),
    ]).then(([hotelData, roomData, serviceData, reviewData]) => {
      setHotel(hotelData);
      setRooms(Array.isArray(roomData) ? roomData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));

    if (user && user.userId) {
      api.getFavoritesByUser(user.userId)
        .then(favs => {
          if (Array.isArray(favs)) {
            setIsFavorite(favs.some(f => f.hotelId === parseInt(id)));
          }
        })
        .catch(() => {});
    }
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isFavorite) {
        await api.removeFavorite(user.userId, id);
        setIsFavorite(false);
      } else {
        await api.addFavorite({ userId: user.userId, hotelId: parseInt(id) });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingError('');
    setBookingSuccess('');
    setBookingLoading(true);

    try {
      const res = await api.createBooking({
        userId: user.userId,
        roomId: selectedRoom.roomId,
        checkInDate,
        checkOutDate,
        guests: parseInt(guests),
        status: 'PENDING',
      });
      setBookingSuccess('Booking created successfully! Redirecting to My Bookings...');
      setTimeout(() => {
        navigate('/my-bookings');
      }, 1500);
    } catch (err) {
      setBookingError(err.message || 'Failed to create booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    setReviewSubmitting(true);
    try {
      const added = await api.addReview({
        userId: user.userId,
        hotelId: parseInt(id),
        rating: parseFloat(newRating),
        comment: newComment,
      });
      setReviews([added, ...reviews]);
      setNewComment('');
    } catch (err) {
      alert(err.message || 'Error submitting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading hotel details...</div>;
  }

  if (!hotel) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Hotel not found.</div>;
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        marginBottom: '2.5rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
      }}>
        <div style={{ height: '320px', position: 'relative', background: '#0f172a' }}>
          <img
            src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
            alt={hotel.hotelName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.85) 100%)',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '2rem'
          }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', color: 'white' }}>
              <div>
                <span style={{ background: '#4f46e5', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  {hotel.category || 'Luxury Stay'}
                </span>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginTop: '0.5rem' }}>{hotel.hotelName}</h1>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#cbd5e1', fontSize: '0.95rem' }}>
                  <MapPin size={16} color="#38bdf8" /> {hotel.location || 'Prime City Location'}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={handleToggleFavorite}
                  style={{
                    background: isFavorite ? '#fee2e2' : 'rgba(255,255,255,0.2)',
                    color: isFavorite ? '#ef4444' : 'white',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '30px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
                  {isFavorite ? 'Saved to Favorites' : 'Add Favorite'}
                </button>
                <div style={{ background: '#fbbf24', color: '#78350f', padding: '0.65rem 1rem', borderRadius: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Star size={18} fill="#78350f" /> {hotel.rating || 4.5} Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
        <div>
          {/* About Hotel */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>About Property</h3>
            <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '0.95rem' }}>
              {hotel.description || 'Welcome to StayRest property management hospitality. Enjoy world-class amenities, clean rooms, and 24/7 service.'}
            </p>
          </div>

          {/* Hotel Services */}
          {services.length > 0 && (
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="#4f46e5" /> Available Hotel Services
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                {services.map(s => (
                  <div key={s.serviceId} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>{s.serviceName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>{s.description || 'Included service'}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4f46e5', marginTop: '0.5rem' }}>
                      {s.price ? `₹${s.price}` : 'Complimentary'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Rooms */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>Available Rooms</h3>
            {rooms.length === 0 ? (
              <p style={{ color: '#64748b' }}>No active rooms registered for this hotel yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {rooms.map(room => (
                  <div key={room.roomId} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc'
                  }}>
                    <div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                        Room {room.roomNumber} ({room.roomType || 'Standard'})
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.3rem', fontSize: '0.85rem', color: '#64748b' }}>
                        <span>Capacity: {room.capacity || 2} Guests</span>
                        <span>•</span>
                        <span style={{ color: room.status === 'AVAILABLE' || !room.status ? '#059669' : '#d97706', fontWeight: 700 }}>
                          {room.status || 'AVAILABLE'}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>₹{room.price || hotel.price || 2000}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>per night</div>
                      </div>
                      <button
                        onClick={() => setSelectedRoom(room)}
                        style={{
                          background: '#4f46e5',
                          color: 'white',
                          padding: '0.65rem 1.25rem',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        Book Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} color="#4f46e5" /> Guest Reviews & Ratings ({reviews.length})
            </h3>

            {/* Add Review Form */}
            {user ? (
              <form onSubmit={handleAddReview} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Write a Review</h4>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Rating (1 to 5 stars)</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      style={{ display: 'block', marginTop: '0.25rem', padding: '0.4rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    >
                      <option value="5">5 ★★★★★ Excellent</option>
                      <option value="4">4 ★★★★☆ Very Good</option>
                      <option value="3">3 ★★★☆☆ Average</option>
                      <option value="2">2 ★★☆☆☆ Poor</option>
                      <option value="1">1 ★☆☆☆☆ Terrible</option>
                    </select>
                  </div>
                </div>
                <textarea
                  required
                  rows="3"
                  placeholder="Share your experience staying at this hotel..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', marginBottom: '0.75rem' }}
                />
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  style={{ background: '#4f46e5', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div style={{ background: '#eef2ff', padding: '1rem', borderRadius: '10px', color: '#4338ca', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Please <a href="/login" style={{ fontWeight: 700, textDecoration: 'underline' }}>log in</a> to post a review.
              </div>
            )}

            {/* Review List */}
            {reviews.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No reviews yet. Be the first guest to write a review!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map(rev => (
                  <div key={rev.reviewId} style={{ padding: '1rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>Guest Review #{rev.userId}</span>
                      <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Star size={14} fill="#fbbf24" /> {rev.rating} / 5
                      </span>
                    </div>
                    <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary Card */}
        <div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Quick Reservation</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4f46e5', marginBottom: '0.25rem' }}>
              ₹{hotel.price || 2500} <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 400 }}>/ night</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>Includes all taxes and StayRest service protection.</p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: '#475569', marginBottom: '1.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} color="#10b981" /> Free Instant Cancellation
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} color="#10b981" /> Verified Hotel Property
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Check size={16} color="#10b981" /> 24/7 Front Desk Assistance
              </li>
            </ul>

            <button
              onClick={() => {
                if (rooms.length > 0) setSelectedRoom(rooms[0]);
                else alert('No available rooms to book at this moment.');
              }}
              style={{
                width: '100%',
                background: '#4f46e5',
                color: 'white',
                padding: '0.85rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem'
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedRoom && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
              Book Room {selectedRoom.roomNumber}
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {hotel.hotelName} • ₹{selectedRoom.price || hotel.price || 2000} per night
            </p>

            {bookingError && (
              <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {bookingError}
              </div>
            )}

            {bookingSuccess && (
              <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {bookingSuccess}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.3rem' }}>
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedRoom.capacity || 4}
                  required
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  style={{ background: '#f1f5f9', color: '#475569', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  style={{ background: '#4f46e5', color: 'white', padding: '0.65rem 1.5rem', borderRadius: '8px', fontWeight: 700 }}
                >
                  {bookingLoading ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
