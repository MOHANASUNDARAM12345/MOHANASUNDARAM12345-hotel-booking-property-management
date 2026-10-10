import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    if (!savedToken || !savedEmail) return null;

    const savedUserId = localStorage.getItem('userId');
    return {
      email: savedEmail,
      role: localStorage.getItem('role') || 'USER',
      userId: savedUserId ? Number.parseInt(savedUserId, 10) : null,
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = (authData, userDetail) => {
    const userId = authData.userId || (userDetail && userDetail.userId);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('email', authData.email);
    localStorage.setItem('role', authData.role);
    if (userId) {
      localStorage.setItem('userId', userId);
    }

    setToken(authData.token);
    setUser({
      email: authData.email,
      role: authData.role,
      userId: userId ? parseInt(userId) : null,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isOwner: user?.role === 'OWNER' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
