package com.stayrest.backend;

import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.RoomRepository;
import com.stayrest.backend.service.BookingService;
import com.stayrest.backend.service.NotificationService;
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

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BookingService bookingService;

    private Booking validBooking;
    private Room validRoom;

    @BeforeEach
    void setUp() {
        validRoom = new Room();
        validRoom.setRoomId(10);
        validRoom.setHotelId(1);
        validRoom.setRoomNumber("101");
        validRoom.setRoomType("Standard");
        validRoom.setStatus("AVAILABLE");
        validRoom.setPrice(1500.0);
        validRoom.setCapacity(2);

        validBooking = new Booking();
        validBooking.setUserId(1);
        validBooking.setRoomId(10);
        validBooking.setHotelId(1);
        validBooking.setCheckInDate(LocalDate.now().plusDays(1));
        validBooking.setCheckOutDate(LocalDate.now().plusDays(3));
        validBooking.setGuests(2);
        validBooking.setTotalAmount(3000.0);
    }

    @Test
    void testCreateBookingSuccess() {
        when(roomRepository.findById(10)).thenReturn(Optional.of(validRoom));
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

        when(roomRepository.findById(10)).thenReturn(Optional.of(validRoom));
        when(bookingRepository.findOverlappingBookings(anyInt(), any(), any()))
                .thenReturn(List.of(existing));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(validBooking);
        });

        assertEquals("Room is already booked for the selected dates", exception.getMessage());
    }

    @Test
    void testMissingRoomThrowsException() {
        when(roomRepository.findById(10)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(validBooking);
        });

        assertEquals("Selected room does not exist", exception.getMessage());
    }

    @Test
    void testRoomFromAnotherHotelThrowsException() {
        validBooking.setHotelId(2); // room 10 belongs to hotel 1
        when(roomRepository.findById(10)).thenReturn(Optional.of(validRoom));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(validBooking);
        });

        assertEquals("Selected room does not belong to this hotel", exception.getMessage());
    }

    @Test
    void testCapacityExceededThrowsException() {
        validBooking.setGuests(5); // room capacity is 2
        when(roomRepository.findById(10)).thenReturn(Optional.of(validRoom));

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(validBooking);
        });

        assertTrue(exception.getMessage().contains("capacity"));
    }
}
