import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    const savedRole = localStorage.getItem('role');
    const savedUserId = localStorage.getItem('userId');

    if (savedToken && savedEmail) {
      setToken(savedToken);
      setUser({
        email: savedEmail,
        role: savedRole || 'USER',
        userId: savedUserId ? parseInt(savedUserId) : null,
      });
    }
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
