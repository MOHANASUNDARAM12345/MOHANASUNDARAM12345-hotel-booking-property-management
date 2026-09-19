package com.stayrest.backend.controller;

import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.service.HotelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/hotels")
public class HotelController {

    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    // Create hotel
    @PostMapping
    public ResponseEntity<Hotel> createHotel(
            @RequestBody Hotel hotel) {

        Hotel savedHotel = hotelService.createHotel(hotel);

        return ResponseEntity.ok(savedHotel);
    }

    // Get all hotels
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {

        return ResponseEntity.ok(
                hotelService.getAllHotels()
        );
    }

    // Get hotel by ID
    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(
            @PathVariable Integer id) {

        return hotelService.getHotelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get hotels by property
    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Hotel>> getHotelsByProperty(
            @PathVariable Integer propertyId) {

        return ResponseEntity.ok(
                hotelService.getHotelsByProperty(propertyId)
        );
    }

    // Update hotel
    @PutMapping("/{id}")
    public ResponseEntity<Hotel> updateHotel(
            @PathVariable Integer id,
            @RequestBody Hotel hotel) {

        return ResponseEntity.ok(
                hotelService.updateHotel(id, hotel)
        );
    }

    // Delete hotel
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHotel(
            @PathVariable Integer id) {

        hotelService.deleteHotel(id);

        return ResponseEntity.ok(
                "Hotel deleted successfully"
        );
    }
}