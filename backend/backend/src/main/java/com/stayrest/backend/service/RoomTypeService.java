package com.stayrest.backend.service;

import com.stayrest.backend.entity.RoomType;
import com.stayrest.backend.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public RoomTypeService(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    public RoomType createRoomType(RoomType roomType) {
        return roomTypeRepository.save(roomType);
    }

    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepository.findAll();
    }

    public Optional<RoomType> getRoomTypeById(Integer id) {
        return roomTypeRepository.findById(id);
    }

    public List<RoomType> getRoomTypesByHotel(Integer hotelId) {
        return roomTypeRepository.findByHotelId(hotelId);
    }

    public RoomType updateRoomType(Integer id, RoomType updated) {
        RoomType existing = roomTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RoomType not found with id: " + id));

        existing.setTypeName(updated.getTypeName());
        existing.setDescription(updated.getDescription());
        existing.setBasePrice(updated.getBasePrice());
        existing.setCapacity(updated.getCapacity());

        return roomTypeRepository.save(existing);
    }

    public void deleteRoomType(Integer id) {
        roomTypeRepository.deleteById(id);
    }
}
