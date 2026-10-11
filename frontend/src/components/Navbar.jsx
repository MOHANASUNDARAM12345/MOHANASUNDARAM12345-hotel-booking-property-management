import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Heart, Bell, Calendar, User, LogOut, ShieldCheck, Home as HomeIcon, Menu, X } from 'lucide-react';

const useIsMobile = (query = '(max-width: 900px)') => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setIsMobile(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return isMobile;
};

export const Navbar = () => {
  const { user, logout, isOwner } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const handleNavigate = () => setMenuOpen(false);

  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    color: '#475569',
    fontWeight: 600,
    fontSize: '0.95rem'
  };

  const links = (
    <>
      <Link to="/" style={navLinkStyle} onClick={handleNavigate}>
        <HomeIcon size={18} /> Home
      </Link>
      <Link to="/hotels" style={navLinkStyle} onClick={handleNavigate}>
        <Hotel size={18} /> Hotels
      </Link>

      {user && (
        <>
          <Link to="/my-bookings" style={navLinkStyle} onClick={handleNavigate}>
            <Calendar size={18} /> Bookings
          </Link>
          <Link to="/favorites" style={navLinkStyle} onClick={handleNavigate}>
            <Heart size={18} /> Favorites
          </Link>
          <Link to="/notifications" style={navLinkStyle} onClick={handleNavigate}>
            <Bell size={18} /> Alerts
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px'
      }}>
        <Link to="/" onClick={handleNavigate} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.35rem', color: '#4f46e5' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Hotel size={24} />
          </div>
          <span>StayRest</span>
        </Link>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {links}

            {isOwner && (
              <Link to="/owner" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#f3e8ff',
                color: '#7e22ce',
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                <ShieldCheck size={18} /> Owner Panel
              </Link>
            )}

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                  <User size={16} color="#4f46e5" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{user.email.split('@')[0]}</span>
                </div>
                <button onClick={handleLogout} style={{
                  background: '#f1f5f9',
                  color: '#64748b',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/login" style={{
                  color: '#4f46e5',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.5rem 1rem'
                }}>
                  Log In
                </Link>
                <Link to="/signup" style={{
                  background: '#4f46e5',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                }}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}

        {isMobile && (
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              background: '#f1f5f9',
              color: '#334155',
              padding: '0.5rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{
          borderTop: '1px solid #e2e8f0',
          background: 'white',
          padding: '1rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)'
        }}>
          {links}

          {isOwner && (
            <Link to="/owner" onClick={handleNavigate} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#f3e8ff',
              color: '#7e22ce',
              padding: '0.5rem 0.85rem',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.85rem',
              width: 'fit-content'
            }}>
              <ShieldCheck size={18} /> Owner Panel
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} color="#4f46e5" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>{user.email.split('@')[0]}</span>
              </div>
              <button onClick={handleLogout} style={{
                background: '#f1f5f9',
                color: '#64748b',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
              <Link to="/login" onClick={handleNavigate} style={{ color: '#4f46e5', fontWeight: 700, fontSize: '0.95rem' }}>
                Log In
              </Link>
              <Link to="/signup" onClick={handleNavigate} style={{
                background: '#4f46e5',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '10px'
              }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
