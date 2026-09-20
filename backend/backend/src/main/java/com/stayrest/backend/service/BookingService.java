package com.stayrest.backend.service;

import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;

    public BookingService(BookingRepository bookingRepository, RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
    }

    public Booking createBooking(Booking booking) {
        validateBooking(booking, null);

        if (booking.getStatus() == null || booking.getStatus().isBlank()) {
            booking.setStatus("PENDING");
        }

        // Auto calculate total amount if not provided or zero
        if (booking.getTotalAmount() == null || booking.getTotalAmount() <= 0) {
            long days = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
            if (days <= 0) days = 1;
            Room room = roomRepository.findById(booking.getRoomId()).orElse(null);
            double pricePerNight = (room != null && room.getPrice() != null) ? room.getPrice() : 1000.0;
            booking.setTotalAmount(pricePerNight * days);
        }

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Integer bookingId) {
        return bookingRepository.findById(bookingId);
    }

    public List<Booking> getBookingsByUser(Integer userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByRoom(Integer roomId) {
        return bookingRepository.findByRoomId(roomId);
    }

    public Booking updateBooking(Integer bookingId, Booking updatedBooking) {
        Booking existingBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));

        validateBooking(updatedBooking, bookingId);

        existingBooking.setUserId(updatedBooking.getUserId());
        existingBooking.setRoomId(updatedBooking.getRoomId());
        existingBooking.setCheckInDate(updatedBooking.getCheckInDate());
        existingBooking.setCheckOutDate(updatedBooking.getCheckOutDate());
        existingBooking.setGuests(updatedBooking.getGuests());
        if (updatedBooking.getStatus() != null) {
            existingBooking.setStatus(updatedBooking.getStatus());
        }
        if (updatedBooking.getTotalAmount() != null) {
            existingBooking.setTotalAmount(updatedBooking.getTotalAmount());
        }

        return bookingRepository.save(existingBooking);
    }

    public void deleteBooking(Integer bookingId) {
        bookingRepository.deleteById(bookingId);
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

        // Check for double booking / overlapping dates
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