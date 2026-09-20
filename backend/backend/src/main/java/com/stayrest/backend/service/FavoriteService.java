package com.stayrest.backend.service;

import com.stayrest.backend.entity.Favorite;
import com.stayrest.backend.repository.FavoriteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }

    public Favorite addFavorite(Favorite favorite) {
        if (favoriteRepository.existsByUserIdAndHotelId(favorite.getUserId(), favorite.getHotelId())) {
            return favoriteRepository.findByUserIdAndHotelId(favorite.getUserId(), favorite.getHotelId()).get();
        }
        return favoriteRepository.save(favorite);
    }

    public List<Favorite> getFavoritesByUser(Integer userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public void removeFavorite(Integer userId, Integer hotelId) {
        favoriteRepository.findByUserIdAndHotelId(userId, hotelId)
                .ifPresent(f -> favoriteRepository.deleteById(f.getFavoriteId()));
    }

    public void deleteFavoriteById(Integer id) {
        favoriteRepository.deleteById(id);
    }
}
