import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CreditCard, Smartphone, Landmark, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = searchParams.get('bookingId');
  const amount = searchParams.get('amount') || '2500';

  const [method, setMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('');
  const [bankName, setBankName] = useState('HDFC Bank');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingId) {
      setError('Invalid Booking ID');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await api.createPayment({
        bookingId: parseInt(bookingId),
        amount: parseFloat(amount),
        method,
        bankName: method === 'NETBANKING' ? bankName : undefined,
        upiId: method === 'UPI' ? upiId : undefined,
        cardNumber: method === 'CARD' ? cardNumber : undefined,
        paymentStatus: 'COMPLETED'
      });

      // Navigate to Invoice
      navigate(`/invoice?paymentId=${res.paymentId}&bookingId=${bookingId}`);
    } catch (err) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '640px' }}>
      <div style={{ background: 'white', padding: '2.5rem', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', pb: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Payment Checkout</h2>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Reservation #{bookingId}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Payable</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>₹{amount}</div>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#991b1b', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {/* Payment Method Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { id: 'CARD', label: 'Card', icon: <CreditCard size={20} /> },
            { id: 'UPI', label: 'UPI / QR', icon: <Smartphone size={20} /> },
            { id: 'NETBANKING', label: 'NetBanking', icon: <Landmark size={20} /> },
          ].map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              style={{
                padding: '0.85rem 0.5rem',
                borderRadius: '12px',
                border: method === m.id ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                background: method === m.id ? '#eef2ff' : 'white',
                color: method === m.id ? '#4f46e5' : '#475569',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {method === 'CARD' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Card Number
              </label>
              <input
                type="text"
                required
                maxLength="19"
                placeholder="4532 0123 4567 8901"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                Card number will be masked as ****-****-****-8901 for PCI security.
              </span>
            </div>
          )}

          {method === 'UPI' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                UPI ID / VPA
              </label>
              <input
                type="text"
                required
                placeholder="name@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              />
            </div>
          )}

          {method === 'NETBANKING' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                Select Bank
              </label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="Axis Bank">Axis Bank</option>
              </select>
            </div>
          )}

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#047857', fontSize: '0.85rem' }}>
            <ShieldCheck size={20} /> 256-Bit Encrypted Secure Payment
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#10b981',
              color: 'white',
              padding: '0.85rem',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.25)'
            }}
          >
            {loading ? 'Processing Payment...' : `Pay ₹${amount}`}
          </button>
        </form>
      </div>
    </div>
  );
};
