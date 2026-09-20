package com.stayrest.backend.controller;

import com.stayrest.backend.entity.HotelStaff;
import com.stayrest.backend.service.HotelStaffService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/staff")
public class HotelStaffController {

    private final HotelStaffService hotelStaffService;

    public HotelStaffController(HotelStaffService hotelStaffService) {
        this.hotelStaffService = hotelStaffService;
    }

    @PostMapping
    public ResponseEntity<HotelStaff> createStaff(@RequestBody HotelStaff staff) {
        return ResponseEntity.ok(hotelStaffService.createStaff(staff));
    }

    @GetMapping
    public ResponseEntity<List<HotelStaff>> getAllStaff() {
        return ResponseEntity.ok(hotelStaffService.getAllStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelStaff> getStaffById(@PathVariable Integer id) {
        return hotelStaffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<HotelStaff>> getStaffByHotel(@PathVariable Integer hotelId) {
        return ResponseEntity.ok(hotelStaffService.getStaffByHotel(hotelId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HotelStaff> updateStaff(@PathVariable Integer id, @RequestBody HotelStaff staff) {
        return ResponseEntity.ok(hotelStaffService.updateStaff(id, staff));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable Integer id) {
        hotelStaffService.deleteStaff(id);
        return ResponseEntity.ok("Staff member deleted successfully");
    }
}
