import React, { Suspense, lazy } from 'react';
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

// Route pages are code-split so the login/signup screens (and the rest of the
// app shell) are shipped and parsed without the heavier booking/owner bundles.
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() =>
  import('./pages/Login').then((m) => ({ default: m.Login }))
);
const Signup = lazy(() =>
  import('./pages/Signup').then((m) => ({ default: m.Signup }))
);
const Hotels = lazy(() => import('./pages/Hotels'));
const HotelDetails = lazy(() =>
  import('./pages/HotelDetails').then((m) => ({ default: m.HotelDetails }))
);
const Rooms = lazy(() =>
  import('./pages/Rooms').then((m) => ({ default: m.Rooms }))
);
const MyBookings = lazy(() =>
  import('./pages/MyBookings').then((m) => ({ default: m.MyBookings }))
);
const PaymentPage = lazy(() =>
  import('./pages/PaymentPage').then((m) => ({ default: m.PaymentPage }))
);
const InvoicePage = lazy(() =>
  import('./pages/InvoicePage').then((m) => ({ default: m.InvoicePage }))
);
const Favorites = lazy(() =>
  import('./pages/Favorites').then((m) => ({ default: m.Favorites }))
);
const Notifications = lazy(() =>
  import('./pages/Notifications').then((m) => ({ default: m.Notifications }))
);
const OwnerDashboard = lazy(() =>
  import('./pages/OwnerDashboard').then((m) => ({ default: m.OwnerDashboard }))
);

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
        <Suspense
          fallback={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 140px)',
                color: '#64748b',
                fontSize: '0.95rem',
              }}
            >
              Loading…
            </div>
          }
        >
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
        </Suspense>
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