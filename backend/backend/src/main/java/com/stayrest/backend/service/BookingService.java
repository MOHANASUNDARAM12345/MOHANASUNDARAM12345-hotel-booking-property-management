package com.stayrest.backend.service;

import com.stayrest.backend.constants.BookingStatus;
import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        Room room = validateBooking(booking, null);

        if (booking.getStatus() == null || booking.getStatus().isBlank()) {
            booking.setStatus(BookingStatus.PENDING);
        }

        // The authoritative price is ALWAYS computed on the server from the
        // room's real nightly rate and the real number of nights. Any amount the
        // browser sent is ignored.
        booking.setTotalAmount(calculateTotal(room, booking.getCheckInDate(), booking.getCheckOutDate()));

        Booking saved = bookingRepository.save(booking);
        refreshRoomStatus(saved.getRoomId());
        return saved;
    }

    /**
     * Nights between check-in and check-out using the hotel convention: checking
     * in on the 14th and out on the 16th is two nights.
     */
    public static long calculateNights(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null) {
            return 0;
        }
        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        return Math.max(nights, 0);
    }

    private double calculateTotal(Room room, LocalDate checkIn, LocalDate checkOut) {
        long nights = Math.max(calculateNights(checkIn, checkOut), 1);
        double rate = (room != null && room.getPrice() != null) ? room.getPrice() : 0.0;
        return Math.round(rate * nights * 100.0) / 100.0;
    }

    @Transactional(readOnly = true)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Booking> getBookingById(Integer bookingId) {
        return bookingRepository.findById(bookingId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByUser(Integer userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public List<Booking> getBookingsByRoom(Integer roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    @Transactional
    public Booking updateBooking(Integer bookingId, Booking updatedBooking) {
        Booking existingBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        // Partial update: only overwrite the fields that are actually provided.
        if (updatedBooking.getUserId() != null) {
            existingBooking.setUserId(updatedBooking.getUserId());
        }
        if (updatedBooking.getRoomId() != null) {
            existingBooking.setRoomId(updatedBooking.getRoomId());
        }
        if (updatedBooking.getCheckInDate() != null) {
            existingBooking.setCheckInDate(updatedBooking.getCheckInDate());
        }
        if (updatedBooking.getCheckOutDate() != null) {
            existingBooking.setCheckOutDate(updatedBooking.getCheckOutDate());
        }
        if (updatedBooking.getGuests() != null) {
            existingBooking.setGuests(updatedBooking.getGuests());
        }
        if (updatedBooking.getStatus() != null) {
            existingBooking.setStatus(updatedBooking.getStatus());
        }
        if (updatedBooking.getTotalAmount() != null) {
            existingBooking.setTotalAmount(updatedBooking.getTotalAmount());
        }

        validateBooking(existingBooking, bookingId);

        Booking saved = bookingRepository.save(existingBooking);
        refreshRoomStatus(saved.getRoomId());
        return saved;
    }

    /**
     * Cancels a booking (idempotent). The room stays/becomes free for other dates.
     */
    @Transactional
    public Booking cancelBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        if (!BookingStatus.CANCELLED.equalsIgnoreCase(booking.getStatus())) {
            booking.setStatus(BookingStatus.CANCELLED);
            booking = bookingRepository.save(booking);
            refreshRoomStatus(booking.getRoomId());
        }
        return booking;
    }

    /**
     * Marks a booking as checked out / completed and frees the room.
     */
    @Transactional
    public Booking checkoutBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        booking.setStatus(BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);
        refreshRoomStatus(booking.getRoomId());
        return booking;
    }

    public void deleteBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        bookingRepository.deleteById(bookingId);
        if (booking != null) {
            refreshRoomStatus(booking.getRoomId());
        }
    }

    /**
     * Updates the room's operational status so that entirely free rooms are
     * marked AVAILABLE and rooms holding an active booking are marked BOOKED.
     * Date-level availability itself is always derived from the bookings table.
     */
    private void refreshRoomStatus(Integer roomId) {
        if (roomId == null) {
            return;
        }
        roomRepository.findById(roomId).ifPresent(room -> {
            boolean active = bookingRepository.findByRoomId(roomId).stream()
                    .anyMatch(b -> b.getStatus() != null
                            && !b.getStatus().equalsIgnoreCase(BookingStatus.CANCELLED)
                            && !b.getStatus().equalsIgnoreCase(BookingStatus.CHECKED_OUT)
                            && !b.getStatus().equalsIgnoreCase(BookingStatus.COMPLETED));

            String target = active ? "BOOKED" : "AVAILABLE";
            if (room.getStatus() == null
                    || (!room.getStatus().equalsIgnoreCase("MAINTENANCE")
                        && !room.getStatus().equalsIgnoreCase("OUT_OF_SERVICE")
                        && !room.getStatus().equalsIgnoreCase(target))) {
                room.setStatus(target);
                roomRepository.save(room);
            }
        });
    }

    @Transactional(readOnly = true)
    public Map<String, Object> calculateRefundEstimate(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        double totalAmount = booking.getTotalAmount() != null ? booking.getTotalAmount() : 0.0;
        LocalDate today = LocalDate.now();
        LocalDate checkIn = booking.getCheckInDate() != null ? booking.getCheckInDate() : today;

        long daysBeforeCheckIn = ChronoUnit.DAYS.between(today, checkIn);
        double refundPercentage = 0.0;
        String policyExplanation = "";

        if (daysBeforeCheckIn >= 7) {
            refundPercentage = 100.0;
            policyExplanation = "Eligible for 100% full refund (Cancelled 7+ days before check-in).";
        } else if (daysBeforeCheckIn >= 3) {
            refundPercentage = 75.0;
            policyExplanation = "Eligible for 75% refund with 25% cancellation fee (Cancelled 3-6 days before check-in).";
        } else if (daysBeforeCheckIn >= 1) {
            refundPercentage = 50.0;
            policyExplanation = "Eligible for 50% refund with 50% cancellation fee (Cancelled 1-2 days before check-in).";
        } else {
            refundPercentage = 0.0;
            policyExplanation = "Non-refundable (Cancelled on check-in day or after).";
        }

        double refundAmount = (totalAmount * refundPercentage) / 100.0;
        double cancellationFee = totalAmount - refundAmount;

        Map<String, Object> result = new HashMap<>();
        result.put("bookingId", bookingId);
        result.put("totalAmount", totalAmount);
        result.put("daysBeforeCheckIn", daysBeforeCheckIn);
        result.put("refundPercentage", refundPercentage);
        result.put("refundAmount", refundAmount);
        result.put("cancellationFee", cancellationFee);
        result.put("policyExplanation", policyExplanation);
        result.put("status", booking.getStatus());

        return result;
    }

    private void validateBooking(Booking booking, Integer currentBookingId) {
        if (booking.getCheckInDate() == null || booking.getCheckOutDate() == null) {
            throw new IllegalArgumentException("Check-in and check-out dates are required");
        }

        if (!booking.getCheckInDate().isBefore(booking.getCheckOutDate())) {
            throw new IllegalArgumentException("Check-in date must be before check-out date");
        }

        if (booking.getGuests() == null || booking.getGuests() <= 0) {
            throw new IllegalArgumentException("Guests count must be greater than 0");
        }

        if (booking.getCheckInDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Check-in date cannot be in the past");
        }

        if (booking.getRoomId() == null) {
            throw new IllegalArgumentException("A room must be selected");
        }

        Room room = roomRepository.findById(booking.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Selected room does not exist"));

        // The room must belong to the hotel the guest booked from.
        if (booking.getHotelId() != null && room.getHotelId() != null
                && !room.getHotelId().equals(booking.getHotelId())) {
            throw new IllegalArgumentException("Selected room does not belong to this hotel");
        }

        if (room.getStatus() != null &&
                ("MAINTENANCE".equalsIgnoreCase(room.getStatus())
                        || "OUT_OF_SERVICE".equalsIgnoreCase(room.getStatus()))) {
            throw new IllegalArgumentException("Room " + room.getRoomNumber() + " is currently under maintenance and cannot be booked");
        }
        if (room.getCapacity() != null && booking.getGuests() > room.getCapacity()) {
            throw new IllegalArgumentException("Selected room capacity is " + room.getCapacity() + " guests, but " + booking.getGuests() + " guests requested");
        }

        // Check for double booking / overlapping dates. Runs inside the
        // transaction so the pessimistic lock in the repository prevents
        // two concurrent requests from booking the same room.
        List<Booking> overlaps = bookingRepository.findOverlappingBookings(
                booking.getRoomId(),
                booking.getCheckInDate(),
                booking.getCheckOutDate()
        );

        boolean isOverlapping = overlaps.stream()
                .anyMatch(b -> currentBookingId == null || !b.getBookingId().equals(currentBookingId));

        if (isOverlapping) {
            throw new IllegalArgumentException("Room is already booked for the selected dates");
        }
    }
}