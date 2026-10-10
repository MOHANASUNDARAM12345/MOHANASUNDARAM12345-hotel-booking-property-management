package com.stayrest.backend;

import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.HotelRepository;
import com.stayrest.backend.repository.RoomRepository;
import com.stayrest.backend.service.SmartStayService;
import com.stayrest.backend.service.SmartStayService.SmartStayRecommendation;
import com.stayrest.backend.service.SmartStayService.SmartStayRequest;
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
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SmartStayServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private SmartStayService smartStayService;

    private Hotel sampleHotel;
    private Room sampleRoom;

    @BeforeEach
    void setUp() {
        sampleHotel = new Hotel();
        sampleHotel.setHotelId(1);
        sampleHotel.setHotelName("Grand Chennai Stay");
        sampleHotel.setLocation("Chennai");
        sampleHotel.setPrice(3000.0);
        sampleHotel.setRating(4.5);
        sampleHotel.setCategory("Luxury");

        sampleRoom = new Room();
        sampleRoom.setRoomId(101);
        sampleRoom.setHotelId(1);
        sampleRoom.setRoomNumber("101");
        sampleRoom.setPrice(3000.0);
        sampleRoom.setCapacity(2);
        sampleRoom.setStatus("AVAILABLE");
    }

    @Test
    void testGetRecommendationsSuccess() {
        when(hotelRepository.findAll()).thenReturn(List.of(sampleHotel));
        when(roomRepository.findByHotelId(anyInt())).thenReturn(List.of(sampleRoom));
        when(bookingRepository.findOverlappingBookings(anyInt(), any(), any())).thenReturn(Collections.emptyList());

        SmartStayRequest req = new SmartStayRequest();
        req.setDestination("Chennai");
        req.setMaxBudget(7000.0);
        req.setGuests(2);
        req.setCheckInDate(LocalDate.now().plusDays(1));
        req.setCheckOutDate(LocalDate.now().plusDays(3));

        List<SmartStayRecommendation> recs = smartStayService.getRecommendations(req);

        assertNotNull(recs);
        assertFalse(recs.isEmpty());
        assertEquals("Grand Chennai Stay", recs.get(0).getHotel().getHotelName());
        assertTrue(recs.get(0).getMatchScore() > 80);
        assertTrue(recs.get(0).isWithinBudget());
        assertNotNull(recs.get(0).getMatchExplanations());
    }
}
