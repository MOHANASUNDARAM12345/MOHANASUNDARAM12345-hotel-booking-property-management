package com.stayrest.backend.service;

import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.entity.Review;
import com.stayrest.backend.repository.HotelRepository;
import com.stayrest.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;

    public ReviewService(ReviewRepository reviewRepository, HotelRepository hotelRepository) {
        this.reviewRepository = reviewRepository;
        this.hotelRepository = hotelRepository;
    }

    public Review addReview(Review review) {
        if (review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Review saved = reviewRepository.save(review);

        // Update hotel average rating
        List<Review> reviews = reviewRepository.findByHotelIdOrderByCreatedAtDesc(review.getHotelId());
        if (!reviews.isEmpty()) {
            double avg = reviews.stream().mapToDouble(r -> r.getRating() != null ? r.getRating() : 0.0).average().orElse(5.0);
            double roundedAvg = Math.round(avg * 10.0) / 10.0;
            Hotel hotel = hotelRepository.findById(review.getHotelId()).orElse(null);
            if (hotel != null) {
                hotel.setRating(roundedAvg);
                hotelRepository.save(hotel);
            }
        }

        return saved;
    }

    public List<Review> getReviewsByHotel(Integer hotelId) {
        return reviewRepository.findByHotelIdOrderByCreatedAtDesc(hotelId);
    }

    public List<Review> getReviewsByUser(Integer userId) {
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void deleteReview(Integer id) {
        reviewRepository.deleteById(id);
    }
}
