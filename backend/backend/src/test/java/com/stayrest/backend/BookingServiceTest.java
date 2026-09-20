package com.stayrest.backend;

import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.RoomRepository;
import com.stayrest.backend.service.BookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingService bookingService;

    private Booking validBooking;

    @BeforeEach
    void setUp() {
        validBooking = new Booking();
        validBooking.setUserId(1);
        validBooking.setRoomId(10);
        validBooking.setCheckInDate(LocalDate.now().plusDays(1));
        validBooking.setCheckOutDate(LocalDate.now().plusDays(3));
        validBooking.setGuests(2);
        validBooking.setTotalAmount(3000.0);
    }

    @Test
    void testCreateBookingSuccess() {
        when(bookingRepository.findOverlappingBookings(anyInt(), any(), any())).thenReturn(Collections.emptyList());
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArgument(0));

        Booking created = bookingService.createBooking(validBooking);

        assertNotNull(created);
        assertEquals("PENDING", created.getStatus());
        verify(bookingRepository, times(1)).save(validBooking);
    }

    @Test
    void testInvalidDatesThrowsException() {
        validBooking.setCheckInDate(LocalDate.now().plusDays(5));
        validBooking.setCheckOutDate(LocalDate.now().plusDays(2)); // Check-in after check-out

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(validBooking);
        });

        assertEquals("Check-in date must be before check-out date", exception.getMessage());
    }

    @Test
    void testZeroGuestsThrowsException() {
        validBooking.setGuests(0);

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(validBooking);
        });

        assertEquals("Guests count must be greater than 0", exception.getMessage());
    }

    @Test
    void testOverlappingDatesThrowsException() {
        Booking existing = new Booking();
        existing.setBookingId(99);

        when(bookingRepository.findOverlappingBookings(anyInt(), any(), any()))
                .thenReturn(List.of(existing));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(validBooking);
        });

        assertEquals("Room is already booked for the selected dates", exception.getMessage());
    }
}
