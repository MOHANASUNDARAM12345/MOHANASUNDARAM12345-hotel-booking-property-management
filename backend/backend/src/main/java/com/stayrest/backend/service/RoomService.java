package com.stayrest.backend.service;

import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Integer roomId) {
        return roomRepository.findById(roomId);
    }

    public List<Room> getRoomsByHotel(Integer hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    public Room updateRoom(Integer roomId, Room updatedRoom) {

        Room existingRoom = roomRepository
                .findById(roomId)
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        existingRoom.setRoomNumber(
                updatedRoom.getRoomNumber()
        );

        existingRoom.setRoomType(
                updatedRoom.getRoomType()
        );

        existingRoom.setStatus(
                updatedRoom.getStatus()
        );

        existingRoom.setPrice(
                updatedRoom.getPrice()
        );

        existingRoom.setCapacity(
                updatedRoom.getCapacity()
        );

        existingRoom.setHotelId(
                updatedRoom.getHotelId()
        );

        existingRoom.setImageUrl(
                updatedRoom.getImageUrl()
        );

        return roomRepository.save(existingRoom);
    }

    public void deleteRoom(Integer roomId) {
        roomRepository.deleteById(roomId);
    }
}