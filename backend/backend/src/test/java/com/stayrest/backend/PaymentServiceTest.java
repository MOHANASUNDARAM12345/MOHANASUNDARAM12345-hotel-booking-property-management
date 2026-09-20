package com.stayrest.backend;

import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Invoice;
import com.stayrest.backend.entity.Payment;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.PaymentRepository;
import com.stayrest.backend.service.InvoiceService;
import com.stayrest.backend.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private InvoiceService invoiceService;

    @InjectMocks
    private PaymentService paymentService;

    private Payment rawPayment;
    private Booking sampleBooking;

    @BeforeEach
    void setUp() {
        sampleBooking = new Booking();
        sampleBooking.setBookingId(100);
        sampleBooking.setTotalAmount(2500.0);
        sampleBooking.setStatus("PENDING");

        rawPayment = new Payment();
        rawPayment.setBookingId(100);
        rawPayment.setAmount(2500.0);
        rawPayment.setMethod("CARD");
        rawPayment.setCardNumber("1234567890123456");
    }

    @Test
    void testCreatePaymentMasksCardNumberAndConfirmsBooking() {
        when(bookingRepository.findById(100)).thenReturn(Optional.of(sampleBooking));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(i -> {
            Payment p = i.getArgument(0);
            p.setPaymentId(50);
            return p;
        });

        Payment created = paymentService.createPayment(rawPayment);

        assertNotNull(created);
        assertEquals("****-****-****-3456", created.getCardNumber());
        assertEquals("COMPLETED", created.getPaymentStatus());
        assertEquals("CONFIRMED", sampleBooking.getStatus());

        verify(bookingRepository, times(1)).save(sampleBooking);
        verify(invoiceService, times(1)).createInvoice(any(Invoice.class));
    }
}
