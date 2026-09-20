package com.stayrest.backend.controller;

import com.stayrest.backend.entity.Room;
import com.stayrest.backend.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(
            @RequestBody Room room) {

        Room savedRoom = roomService.createRoom(room);

        return ResponseEntity.ok(savedRoom);
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {

        return ResponseEntity.ok(
                roomService.getAllRooms()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(
            @PathVariable Integer id) {

        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Room>> getRoomsByHotel(
            @PathVariable Integer hotelId) {

        return ResponseEntity.ok(
                roomService.getRoomsByHotel(hotelId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Integer id,
            @RequestBody Room room) {

        return ResponseEntity.ok(
                roomService.updateRoom(id, room)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(
            @PathVariable Integer id) {

        roomService.deleteRoom(id);

        return ResponseEntity.ok(
                "Room deleted successfully"
        );
    }
}