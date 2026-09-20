package com.stayrest.backend.controller;

import com.stayrest.backend.entity.Favorite;
import com.stayrest.backend.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public ResponseEntity<Favorite> addFavorite(@RequestBody Favorite favorite) {
        return ResponseEntity.ok(favoriteService.addFavorite(favorite));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Favorite>> getFavoritesByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(favoriteService.getFavoritesByUser(userId));
    }

    @DeleteMapping("/user/{userId}/hotel/{hotelId}")
    public ResponseEntity<String> removeFavorite(@PathVariable Integer userId, @PathVariable Integer hotelId) {
        favoriteService.removeFavorite(userId, hotelId);
        return ResponseEntity.ok("Favorite removed successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFavoriteById(@PathVariable Integer id) {
        favoriteService.deleteFavoriteById(id);
        return ResponseEntity.ok("Favorite deleted successfully");
    }
}
