import React from 'react';
import { Hotel } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '3rem 0 1.5rem 0',
      marginTop: '4rem',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'white', fontWeight: 800, fontSize: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ background: '#4f46e5', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
                <Hotel size={20} color="white" />
              </div>
              StayRest Management
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Full Stack Hotel Booking and Property Management Capstone System powered by Spring Boot & React.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 700 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li><a href="/hotels">Browse Hotels</a></li>
              <li><a href="/my-bookings">My Bookings</a></li>
              <li><a href="/favorites">Saved Favorites</a></li>
              <li><a href="/login">User Login</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 700 }}>Property Owners</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <li><a href="/owner">Owner Dashboard</a></li>
              <li><a href="/owner">Manage Properties</a></li>
              <li><a href="/owner">Room & Staff Management</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '0.95rem', fontWeight: 700 }}>Tech Stack</h4>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              Java 17 • Spring Boot 4 • PostgreSQL • Spring Security JWT • React.js • REST APIs
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem' }}>
          © 2026 StayRest Hotel Booking & Property Management System. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
