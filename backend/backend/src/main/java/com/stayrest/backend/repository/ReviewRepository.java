package com.stayrest.backend.repository;

import com.stayrest.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByHotelIdOrderByCreatedAtDesc(Integer hotelId);
    List<Review> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
