import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Hotels } from './pages/Hotels';
import { HotelDetails } from './pages/HotelDetails';
import { Rooms } from './pages/Rooms';
import { MyBookings } from './pages/MyBookings';
import { PaymentPage } from './pages/PaymentPage';
import { InvoicePage } from './pages/InvoicePage';
import { Favorites } from './pages/Favorites';
import { Notifications } from './pages/Notifications';
import { OwnerDashboard } from './pages/OwnerDashboard';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetails />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/invoice" element={<InvoicePage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/owner" element={<OwnerDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
