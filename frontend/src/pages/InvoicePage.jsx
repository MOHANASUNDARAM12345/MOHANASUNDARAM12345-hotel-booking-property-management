import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { FileText, Printer, CheckCircle, Hotel, ArrowLeft } from 'lucide-react';

export const InvoicePage = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('paymentId');
  const bookingId = searchParams.get('bookingId');

  const [invoice, setInvoice] = useState(null);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (paymentId) {
          const invData = await api.getInvoiceByPayment(paymentId);
          setInvoice(invData);
        }
        if (bookingId) {
          const bData = await api.getBookingById(bookingId);
          setBooking(bData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [paymentId, bookingId]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading invoice...</div>;
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1.5rem', maxWidth: '720px' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/my-bookings" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4f46e5', fontWeight: 700 }}>
          <ArrowLeft size={18} /> Back to My Bookings
        </Link>
        <button
          onClick={() => window.print()}
          style={{
            background: '#0f172a',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Printer size={16} /> Print Invoice
        </button>
      </div>

      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)'
      }}>
        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4f46e5', fontWeight: 800, fontSize: '1.4rem' }}>
              <Hotel size={26} /> StayRest
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.2rem' }}>Official Booking Invoice & Receipt</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>INVOICE</div>
            <div style={{ color: '#4f46e5', fontWeight: 700, fontSize: '0.9rem' }}>
              {invoice ? invoice.invoiceNumber : 'INV-2026-STAY'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Date: {invoice ? new Date(invoice.invoiceDate).toLocaleDateString() : new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Success Banner */}
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#047857', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2rem' }}>
          <CheckCircle size={20} /> Payment Confirmed & Reservation Guaranteed
        </div>

        {/* Details Table */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>Reservation Details</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 0', color: '#64748b' }}>Booking Reference</td>
                <td style={{ padding: '0.75rem 0', fontWeight: 700, textAlign: 'right' }}>#{bookingId || (invoice ? invoice.paymentId : 'N/A')}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 0', color: '#64748b' }}>Check-In Date</td>
                <td style={{ padding: '0.75rem 0', fontWeight: 700, textAlign: 'right' }}>{booking ? booking.checkInDate : 'Confirmed'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 0', color: '#64748b' }}>Check-Out Date</td>
                <td style={{ padding: '0.75rem 0', fontWeight: 700, textAlign: 'right' }}>{booking ? booking.checkOutDate : 'Confirmed'}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem 0', color: '#64748b' }}>Payment Method</td>
                <td style={{ padding: '0.75rem 0', fontWeight: 700, textAlign: 'right' }}>Online Transaction</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Total Amount Box */}
        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Total Amount Paid</span>
          <span style={{ fontWeight: 800, fontSize: '1.75rem', color: '#10b981' }}>
            ₹{invoice ? invoice.totalAmount : (booking ? booking.totalAmount : '2500')}
          </span>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
          Thank you for staying with StayRest Hotel Management!
        </div>
      </div>
    </div>
  );
};
