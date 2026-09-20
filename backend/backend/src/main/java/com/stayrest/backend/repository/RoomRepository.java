package com.stayrest.backend.repository;

import com.stayrest.backend.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    List<Room> findByHotelId(Integer hotelId);
}