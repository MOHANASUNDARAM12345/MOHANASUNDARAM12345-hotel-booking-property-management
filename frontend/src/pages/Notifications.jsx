import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Clock } from 'lucide-react';

export const Notifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [user]);

  const fetchNotifications = () => {
    setLoading(true);
    api.getNotificationsByUser(user.userId)
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2.5rem 1.5rem', maxWidth: '720px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Notification Center</h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Updates on your reservations, offers, and payment confirmations</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <Bell size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No Notifications</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {notifications.map(notif => (
            <div key={notif.notificationId} style={{
              background: notif.isRead ? 'white' : '#eef2ff',
              padding: '1.25rem',
              borderRadius: '14px',
              border: notif.isRead ? '1px solid #e2e8f0' : '1px solid #c7d2fe',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{notif.title}</h4>
                  {!notif.isRead && (
                    <span style={{ background: '#4f46e5', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
                      NEW
                    </span>
                  )}
                </div>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5' }}>{notif.message}</p>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={12} /> {new Date(notif.createdAt).toLocaleString()}
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkRead(notif.notificationId)}
                  style={{
                    background: 'white',
                    color: '#4f46e5',
                    border: '1px solid #c7d2fe',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
