package com.stayrest.backend.service;

import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Invoice;
import com.stayrest.backend.entity.Payment;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final InvoiceService invoiceService;

    public PaymentService(PaymentRepository paymentRepository,
                          BookingRepository bookingRepository,
                          InvoiceService invoiceService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.invoiceService = invoiceService;
    }

    public Payment createPayment(Payment payment) {
        if (payment.getBookingId() == null) {
            throw new IllegalArgumentException("Booking ID is required for payment");
        }

        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + payment.getBookingId()));

        if (payment.getAmount() == null || payment.getAmount() <= 0) {
            payment.setAmount(booking.getTotalAmount() != null ? booking.getTotalAmount() : 0.0);
        }

        if (payment.getTransactionId() == null || payment.getTransactionId().isBlank()) {
            payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase());
        }

        // Mask card number for security compliance
        if (payment.getCardNumber() != null && payment.getCardNumber().length() >= 4) {
            String clean = payment.getCardNumber().replaceAll("\\s|-", "");
            String last4 = clean.length() >= 4 ? clean.substring(clean.length() - 4) : clean;
            payment.setCardNumber("****-****-****-" + last4);
        }

        if (payment.getPaymentStatus() == null || payment.getPaymentStatus().isBlank()) {
            payment.setPaymentStatus("COMPLETED");
        }

        Payment savedPayment = paymentRepository.save(payment);

        // Update booking status to CONFIRMED
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        // Auto-generate invoice
        Invoice invoice = new Invoice();
        invoice.setPaymentId(savedPayment.getPaymentId());
        invoice.setTotalAmount(savedPayment.getAmount());
        invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        invoiceService.createInvoice(invoice);

        return savedPayment;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Integer id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> getPaymentsByBooking(Integer bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    public Payment updatePayment(Integer id, Payment updated) {
        Payment existing = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + id));

        existing.setPaymentStatus(updated.getPaymentStatus());
        existing.setMethod(updated.getMethod());
        existing.setBankName(updated.getBankName());

        return paymentRepository.save(existing);
    }

    public void deletePayment(Integer id) {
        paymentRepository.deleteById(id);
    }
}
