package com.stayrest.backend.repository;

import com.stayrest.backend.entity.HotelServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<HotelServiceItem, Integer> {
    List<HotelServiceItem> findByHotelId(Integer hotelId);
}
