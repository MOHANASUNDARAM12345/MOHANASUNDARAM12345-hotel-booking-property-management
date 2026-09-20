package com.stayrest.backend.repository;

import com.stayrest.backend.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoomTypeRepository extends JpaRepository<RoomType, Integer> {
    List<RoomType> findByHotelId(Integer hotelId);
}
