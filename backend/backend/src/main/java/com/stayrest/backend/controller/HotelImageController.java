package com.stayrest.backend.controller;

import com.stayrest.backend.entity.HotelImage;
import com.stayrest.backend.service.HotelImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/hotel-images")
public class HotelImageController {

    private final HotelImageService hotelImageService;

    public HotelImageController(HotelImageService hotelImageService) {
        this.hotelImageService = hotelImageService;
    }

    @PostMapping
    public ResponseEntity<HotelImage> addImage(@RequestBody HotelImage image) {
        return ResponseEntity.ok(hotelImageService.addImage(image));
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<HotelImage>> getImagesByHotel(@PathVariable Integer hotelId) {
        return ResponseEntity.ok(hotelImageService.getImagesByHotel(hotelId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteImage(@PathVariable Integer id) {
        hotelImageService.deleteImage(id);
        return ResponseEntity.ok("Image deleted successfully");
    }
}
