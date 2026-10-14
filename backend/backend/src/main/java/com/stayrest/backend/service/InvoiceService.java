package com.stayrest.backend.service;

import com.stayrest.backend.dto.InvoiceDetailResponse;
import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.entity.Invoice;
import com.stayrest.backend.entity.Payment;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.HotelRepository;
import com.stayrest.backend.repository.InvoiceRepository;
import com.stayrest.backend.repository.PaymentRepository;
import com.stayrest.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    public InvoiceService(InvoiceRepository invoiceRepository,
                          PaymentRepository paymentRepository,
                          BookingRepository bookingRepository,
                          RoomRepository roomRepository,
                          HotelRepository hotelRepository) {
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
    }

    public Invoice createInvoice(Invoice invoice) {

        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isBlank()) {
            invoice.setInvoiceNumber(
                    "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()
            );
        }

        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Integer id) {
        return invoiceRepository.findById(id);
    }

    public List<Invoice> getInvoiceByPayment(Integer paymentId) {
        return invoiceRepository.findByPaymentId(paymentId);
    }

    /**
     * Builds the full invoice/receipt view for a booking. The authoritative
     * amount is taken from the stored invoice first, then the stored payment,
     * then the booking total, so the receipt never re-invents a different value
     * than what was actually captured and persisted.
     */
    @Transactional(readOnly = true)
    public InvoiceDetailResponse getInvoiceDetailByBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        return buildDetail(booking);
    }

    @Transactional(readOnly = true)
    public InvoiceDetailResponse getInvoiceDetailByPayment(Integer paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));
        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found with ID: " + payment.getBookingId()));
        return buildDetail(booking);
    }

    private InvoiceDetailResponse buildDetail(Booking booking) {
        InvoiceDetailResponse response = new InvoiceDetailResponse();

        response.setBookingId(booking.getBookingId());
        response.setBookingDate(booking.getBookingDate());
        response.setCheckInDate(booking.getCheckInDate());
        response.setCheckOutDate(booking.getCheckOutDate());
        response.setGuests(booking.getGuests());
        response.setBookingStatus(booking.getStatus());
        response.setGuestUserId(booking.getUserId());

        long nights = 0;
        if (booking.getCheckInDate() != null && booking.getCheckOutDate() != null) {
            nights = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        }
        response.setNights(nights);

        Room room = booking.getRoomId() != null
                ? roomRepository.findById(booking.getRoomId()).orElse(null)
                : null;
        if (room != null) {
            response.setRoomId(room.getRoomId());
            response.setRoomNumber(room.getRoomNumber());
            response.setRoomType(room.getRoomType());
            response.setRoomCapacity(room.getCapacity());
            response.setRatePerNight(room.getPrice());
            response.setHotelId(room.getHotelId());

            if (room.getHotelId() != null) {
                Hotel hotel = hotelRepository.findById(room.getHotelId()).orElse(null);
                if (hotel != null) {
                    response.setHotelName(hotel.getHotelName());
                    response.setHotelLocation(hotel.getLocation());
                }
            }
        }

        Payment payment = paymentRepository
                .findFirstByBookingIdOrderByPaymentIdDesc(booking.getBookingId())
                .orElse(null);
        Invoice invoice = null;
        if (payment != null) {
            response.setPaymentId(payment.getPaymentId());
            response.setPaymentMethod(payment.getMethod());
            response.setPaymentStatus(payment.getPaymentStatus());
            response.setPaymentDate(payment.getPaymentDate());
            response.setTransactionId(payment.getTransactionId());

            invoice = invoiceRepository
                    .findFirstByPaymentIdOrderByInvoiceIdDesc(payment.getPaymentId())
                    .orElse(null);
        }

        if (invoice != null) {
            response.setInvoiceNumber(invoice.getInvoiceNumber());
            response.setInvoiceDate(invoice.getInvoiceDate());
        } else if (payment != null) {
            response.setInvoiceDate(payment.getPaymentDate());
        }

        // Authoritative paid amount: persisted invoice, then persisted payment,
        // then the booking's own total. Never invent a value.
        Double amountPaid = null;
        if (invoice != null && invoice.getTotalAmount() != null) {
            amountPaid = invoice.getTotalAmount();
        } else if (payment != null && payment.getAmount() != null) {
            amountPaid = payment.getAmount();
        } else if (booking.getTotalAmount() != null) {
            amountPaid = booking.getTotalAmount();
        }
        response.setAmountPaid(amountPaid);

        InvoiceDetailResponse.PriceBreakdown breakdown = new InvoiceDetailResponse.PriceBreakdown();
        Double rate = room != null ? room.getPrice() : null;
        if (rate == null && amountPaid != null && nights > 0) {
            rate = Math.round((amountPaid / nights) * 100.0) / 100.0;
        }
        breakdown.setRatePerNight(rate);
        breakdown.setNights(nights);
        Double subtotal = (rate != null && nights > 0)
                ? Math.round(rate * nights * 100.0) / 100.0
                : amountPaid;
        breakdown.setSubtotal(subtotal);
        breakdown.setTotal(amountPaid != null ? amountPaid : subtotal);
        response.setPriceBreakdown(breakdown);

        return response;
    }

    public Invoice updateInvoice(Integer id, Invoice updated) {

        Invoice existing = invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found with ID: " + id)
                );

        existing.setTotalAmount(updated.getTotalAmount());

        if (updated.getInvoiceNumber() != null
                && !updated.getInvoiceNumber().isBlank()) {
            existing.setInvoiceNumber(updated.getInvoiceNumber());
        }

        return invoiceRepository.save(existing);
    }

    public void deleteInvoice(Integer id) {
        invoiceRepository.deleteById(id);
    }
}
