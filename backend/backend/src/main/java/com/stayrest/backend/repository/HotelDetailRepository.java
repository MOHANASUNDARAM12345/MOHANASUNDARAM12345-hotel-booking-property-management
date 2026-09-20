package com.stayrest.backend.repository;

import com.stayrest.backend.entity.HotelDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HotelDetailRepository extends JpaRepository<HotelDetail, Integer> {
    Optional<HotelDetail> findByHotelId(Integer hotelId);
}
