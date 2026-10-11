package com.stayrest.backend;

import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.RoomRepository;
import com.stayrest.backend.service.RoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private RoomService roomService;

    private final LocalDate checkIn = LocalDate.now().plusDays(1);
    private final LocalDate checkOut = LocalDate.now().plusDays(3);

    private Room room(int id, String status, int capacity) {
        Room room = new Room();
        room.setRoomId(id);
        room.setHotelId(1);
        room.setRoomNumber(String.valueOf(id));
        room.setStatus(status);
        room.setCapacity(capacity);
        room.setPrice(1000.0);
        return room;
    }

    @BeforeEach
    void setUp() {
        lenient().when(bookingRepository.findOverlappingBookings(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Collections.emptyList());
    }

    @Test
    void returnsAllRoomsWhenNothingIsBooked() {
        when(roomRepository.findByHotelId(1))
                .thenReturn(List.of(room(1, "AVAILABLE", 2), room(2, "AVAILABLE", 3)));

        List<Room> available = roomService.getAvailableRoomsByHotel(1, checkIn, checkOut, 1);

        assertEquals(2, available.size());
    }

    @Test
    void excludesRoomsWithOverlappingBookings() {
        Booking booking = new Booking();
        booking.setRoomId(1);
        when(bookingRepository.findOverlappingBookings(any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(booking));
        when(roomRepository.findByHotelId(1))
                .thenReturn(List.of(room(1, "AVAILABLE", 2), room(2, "AVAILABLE", 3)));

        List<Room> available = roomService.getAvailableRoomsByHotel(1, checkIn, checkOut, 1);

        assertEquals(1, available.size());
        assertEquals(2, available.get(0).getRoomId());
    }

    @Test
    void excludesOutOfServiceRooms() {
        when(roomRepository.findByHotelId(1))
                .thenReturn(List.of(room(1, "MAINTENANCE", 2), room(2, "OUT_OF_SERVICE", 2), room(3, "AVAILABLE", 2)));

        List<Room> available = roomService.getAvailableRoomsByHotel(1, checkIn, checkOut, 1);

        assertEquals(1, available.size());
        assertEquals(3, available.get(0).getRoomId());
    }

    @Test
    void filtersRoomsThatCannotFitTheGuests() {
        when(roomRepository.findByHotelId(1))
                .thenReturn(List.of(room(1, "AVAILABLE", 2), room(2, "AVAILABLE", 4)));

        List<Room> available = roomService.getAvailableRoomsByHotel(1, checkIn, checkOut, 4);

        assertEquals(1, available.size());
        assertEquals(2, available.get(0).getRoomId());
    }

    @Test
    void rejectsCheckInOnOrAfterCheckOut() {
        assertThrows(IllegalArgumentException.class,
                () -> roomService.getAvailableRoomsByHotel(1, checkOut, checkIn, 1));
    }
}
