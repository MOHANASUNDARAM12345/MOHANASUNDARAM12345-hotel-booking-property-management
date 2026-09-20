package com.stayrest.backend.repository;

import com.stayrest.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    List<Favorite> findByUserId(Integer userId);
    Optional<Favorite> findByUserIdAndHotelId(Integer userId, Integer hotelId);
    boolean existsByUserIdAndHotelId(Integer userId, Integer hotelId);
    void deleteByUserIdAndHotelId(Integer userId, Integer hotelId);
}
