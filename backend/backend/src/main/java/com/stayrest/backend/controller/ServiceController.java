package com.stayrest.backend.controller;

import com.stayrest.backend.entity.HotelServiceItem;
import com.stayrest.backend.service.HotelServiceItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ServiceController {

    private final HotelServiceItemService hotelServiceItemService;

    public ServiceController(HotelServiceItemService hotelServiceItemService) {
        this.hotelServiceItemService = hotelServiceItemService;
    }

    @PostMapping("/api/owner/services")
    public ResponseEntity<HotelServiceItem> createService(@RequestBody HotelServiceItem item) {
        return ResponseEntity.ok(hotelServiceItemService.createService(item));
    }

    @GetMapping("/api/services")
    public ResponseEntity<List<HotelServiceItem>> getAllServices() {
        return ResponseEntity.ok(hotelServiceItemService.getAllServices());
    }

    @GetMapping("/api/services/{id}")
    public ResponseEntity<HotelServiceItem> getServiceById(@PathVariable Integer id) {
        return hotelServiceItemService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/api/services/hotel/{hotelId}")
    public ResponseEntity<List<HotelServiceItem>> getServicesByHotel(@PathVariable Integer hotelId) {
        return ResponseEntity.ok(hotelServiceItemService.getServicesByHotel(hotelId));
    }

    @PutMapping("/api/owner/services/{id}")
    public ResponseEntity<HotelServiceItem> updateService(@PathVariable Integer id, @RequestBody HotelServiceItem item) {
        return ResponseEntity.ok(hotelServiceItemService.updateService(id, item));
    }

    @DeleteMapping("/api/owner/services/{id}")
    public ResponseEntity<String> deleteService(@PathVariable Integer id) {
        hotelServiceItemService.deleteService(id);
        return ResponseEntity.ok("Service item deleted successfully");
    }
}
