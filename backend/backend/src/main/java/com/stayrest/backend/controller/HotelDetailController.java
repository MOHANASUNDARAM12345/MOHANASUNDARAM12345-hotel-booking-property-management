package com.stayrest.backend.controller;

import com.stayrest.backend.entity.HotelDetail;
import com.stayrest.backend.service.HotelDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/hotel-details")
public class HotelDetailController {

    private final HotelDetailService hotelDetailService;

    public HotelDetailController(HotelDetailService hotelDetailService) {
        this.hotelDetailService = hotelDetailService;
    }

    @PostMapping
    public ResponseEntity<HotelDetail> saveDetail(@RequestBody HotelDetail detail) {
        return ResponseEntity.ok(hotelDetailService.saveOrUpdateHotelDetail(detail));
    }

    @GetMapping
    public ResponseEntity<List<HotelDetail>> getAllDetails() {
        return ResponseEntity.ok(hotelDetailService.getAllHotelDetails());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDetail> getDetailById(@PathVariable Integer id) {
        return hotelDetailService.getHotelDetailById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<HotelDetail> getDetailByHotel(@PathVariable Integer hotelId) {
        return hotelDetailService.getHotelDetailByHotel(hotelId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDetail(@PathVariable Integer id) {
        hotelDetailService.deleteHotelDetail(id);
        return ResponseEntity.ok("Hotel detail deleted successfully");
    }
}
