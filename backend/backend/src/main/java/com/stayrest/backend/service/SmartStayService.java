package com.stayrest.backend.service;

import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.HotelRepository;
import com.stayrest.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SmartStayService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public SmartStayService(HotelRepository hotelRepository,
                            RoomRepository roomRepository,
                            BookingRepository bookingRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    public static class SmartStayRequest {
        private String destination;
        private LocalDate checkInDate;
        private LocalDate checkOutDate;
        private Integer guests = 1;
        private Double maxBudget;
        private String preferredCategory;
        private Double minRating;

        // Getters and Setters
        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }

        public LocalDate getCheckInDate() { return checkInDate; }
        public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }

        public LocalDate getCheckOutDate() { return checkOutDate; }
        public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }

        public Integer getGuests() { return guests; }
        public void setGuests(Integer guests) { this.guests = guests; }

        public Double getMaxBudget() { return maxBudget; }
        public void setMaxBudget(Double maxBudget) { this.maxBudget = maxBudget; }

        public String getPreferredCategory() { return preferredCategory; }
        public void setPreferredCategory(String preferredCategory) { this.preferredCategory = preferredCategory; }

        public Double getMinRating() { return minRating; }
        public void setMinRating(Double minRating) { this.minRating = minRating; }
    }

    public static class SmartStayRecommendation {
        private Hotel hotel;
        private Room recommendedRoom;
        private double estimatedPricePerNight;
        private double estimatedTotalPrice;
        private long totalNights;
        private int matchScore;
        private List<String> matchExplanations;
        private boolean withinBudget;

        public Hotel getHotel() { return hotel; }
        public void setHotel(Hotel hotel) { this.hotel = hotel; }

        public Room getRecommendedRoom() { return recommendedRoom; }
        public void setRecommendedRoom(Room recommendedRoom) { this.recommendedRoom = recommendedRoom; }

        public double getEstimatedPricePerNight() { return estimatedPricePerNight; }
        public void setEstimatedPricePerNight(double estimatedPricePerNight) { this.estimatedPricePerNight = estimatedPricePerNight; }

        public double getEstimatedTotalPrice() { return estimatedTotalPrice; }
        public void setEstimatedTotalPrice(double estimatedTotalPrice) { this.estimatedTotalPrice = estimatedTotalPrice; }

        public long getTotalNights() { return totalNights; }
        public void setTotalNights(long totalNights) { this.totalNights = totalNights; }

        public int getMatchScore() { return matchScore; }
        public void setMatchScore(int matchScore) { this.matchScore = matchScore; }

        public List<String> getMatchExplanations() { return matchExplanations; }
        public void setMatchExplanations(List<String> matchExplanations) { this.matchExplanations = matchExplanations; }

        public boolean isWithinBudget() { return withinBudget; }
        public void setWithinBudget(boolean withinBudget) { this.withinBudget = withinBudget; }
    }

    public List<SmartStayRecommendation> getRecommendations(SmartStayRequest request) {
        List<Hotel> allHotels = hotelRepository.findAll();
        LocalDate checkIn = request.getCheckInDate() != null ? request.getCheckInDate() : LocalDate.now().plusDays(1);
        LocalDate checkOut = request.getCheckOutDate() != null ? request.getCheckOutDate() : LocalDate.now().plusDays(2);

        if (!checkIn.isBefore(checkOut)) {
            checkOut = checkIn.plusDays(1);
        }

        long nights = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (nights <= 0) nights = 1;

        final long totalNights = nights;
        List<SmartStayRecommendation> recommendations = new ArrayList<>();

        for (Hotel hotel : allHotels) {
            // Destination Filter if provided
            if (request.getDestination() != null && !request.getDestination().isBlank()) {
                if (hotel.getLocation() == null ||
                    !hotel.getLocation().toLowerCase().contains(request.getDestination().toLowerCase())) {
                    continue;
                }
            }

            // Minimum Rating Filter if provided
            if (request.getMinRating() != null && hotel.getRating() != null) {
                if (hotel.getRating() < request.getMinRating()) {
                    continue;
                }
            }

            // Find bookable room for this hotel
            List<Room> rooms = roomRepository.findByHotelId(hotel.getHotelId());
            Room bestRoom = null;

            for (Room r : rooms) {
                // Skip non-ready rooms
                if (r.getStatus() != null && (r.getStatus().equalsIgnoreCase("MAINTENANCE") || r.getStatus().equalsIgnoreCase("OUT_OF_SERVICE"))) {
                    continue;
                }

                // Check guest capacity
                if (request.getGuests() != null && r.getCapacity() != null && r.getCapacity() < request.getGuests()) {
                    continue;
                }

                // Check date overlap
                List<?> overlaps = bookingRepository.findOverlappingBookings(r.getRoomId(), checkIn, checkOut);
                if (overlaps.isEmpty()) {
                    if (bestRoom == null || (r.getPrice() != null && bestRoom.getPrice() != null && r.getPrice() < bestRoom.getPrice())) {
                        bestRoom = r;
                    }
                }
            }

            // Calculate match score and breakdown
            double pricePerNight = (bestRoom != null && bestRoom.getPrice() != null) ? bestRoom.getPrice() : (hotel.getPrice() != null ? hotel.getPrice() : 2000.0);
            double totalPrice = pricePerNight * totalNights;

            int score = 0;
            List<String> explanations = new ArrayList<>();

            // 1. Budget Fit Score (Max 35 pts)
            boolean withinBudget = true;
            if (request.getMaxBudget() != null && request.getMaxBudget() > 0) {
                if (totalPrice <= request.getMaxBudget()) {
                    score += 35;
                    explanations.add("Fits inside your total budget of ₹" + String.format("%.0f", request.getMaxBudget()) + " (+35%)");
                } else {
                    withinBudget = false;
                    double diff = totalPrice - request.getMaxBudget();
                    int partial = Math.max(0, 35 - (int) ((diff / request.getMaxBudget()) * 35));
                    score += partial;
                    explanations.add("Exceeds target budget by ₹" + String.format("%.0f", diff) + " (Partial Score +" + partial + "%)");
                }
            } else {
                score += 35;
                explanations.add("Competitive pricing at ₹" + String.format("%.0f", pricePerNight) + "/night (+35%)");
            }

            // 2. Location Match Score (Max 25 pts)
            if (request.getDestination() != null && !request.getDestination().isBlank()) {
                score += 25;
                explanations.add("Direct match for destination '" + request.getDestination() + "' (+25%)");
            } else {
                score += 25;
                explanations.add("Prime location in " + (hotel.getLocation() != null ? hotel.getLocation() : "City Center") + " (+25%)");
            }

            // 3. Rating Score (Max 20 pts)
            double rating = hotel.getRating() != null ? hotel.getRating() : 4.0;
            int ratingPts = (int) Math.round((rating / 5.0) * 20.0);
            score += ratingPts;
            explanations.add("Customer satisfaction rating " + rating + "/5 (+ " + ratingPts + "%)");

            // 4. Category & Room Capacity Fit (Max 20 pts)
            if (request.getPreferredCategory() != null && hotel.getCategory() != null &&
                hotel.getCategory().equalsIgnoreCase(request.getPreferredCategory())) {
                score += 20;
                explanations.add("Matches preferred stay style: " + hotel.getCategory() + " (+20%)");
            } else {
                score += 15;
                explanations.add("Available room fits " + (request.getGuests() != null ? request.getGuests() : 1) + " guest(s) (+15%)");
            }

            SmartStayRecommendation rec = new SmartStayRecommendation();
            rec.setHotel(hotel);
            rec.setRecommendedRoom(bestRoom);
            rec.setEstimatedPricePerNight(pricePerNight);
            rec.setEstimatedTotalPrice(totalPrice);
            rec.setTotalNights(totalNights);
            rec.setMatchScore(Math.min(100, score));
            rec.setMatchExplanations(explanations);
            rec.setWithinBudget(withinBudget);

            recommendations.add(rec);
        }

        // Sort by match score descending
        recommendations.sort((a, b) -> Integer.compare(b.getMatchScore(), a.getMatchScore()));
        return recommendations;
    }
}
