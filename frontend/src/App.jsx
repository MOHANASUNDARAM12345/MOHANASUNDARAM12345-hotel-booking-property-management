import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GuestAssistantWidget } from './components/GuestAssistantWidget';

import Home from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import Hotels from './pages/Hotels';
import { HotelDetails } from './pages/HotelDetails';
import { Rooms } from './pages/Rooms';
import { MyBookings } from './pages/MyBookings';
import { PaymentPage } from './pages/PaymentPage';
import { InvoicePage } from './pages/InvoicePage';
import { Favorites } from './pages/Favorites';
import { Notifications } from './pages/Notifications';
import { OwnerDashboard } from './pages/OwnerDashboard';

function ProtectedRoute({ children, ownerOnly = false }) {
  const { user, isOwner } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (ownerOnly && !isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetails />} />

          <Route path="/rooms" element={<Rooms />} />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoice"
            element={
              <ProtectedRoute>
                <InvoicePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute ownerOnly>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />

      <GuestAssistantWidget />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;