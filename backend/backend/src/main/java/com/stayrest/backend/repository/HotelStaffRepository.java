package com.stayrest.backend.repository;

import com.stayrest.backend.entity.HotelStaff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HotelStaffRepository extends JpaRepository<HotelStaff, Integer> {
    List<HotelStaff> findByHotelId(Integer hotelId);
}
