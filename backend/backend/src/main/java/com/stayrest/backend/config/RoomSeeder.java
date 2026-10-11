package com.stayrest.backend.config;

import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.HotelRepository;
import com.stayrest.backend.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Idempotent data seeder. On every application start it makes sure each existing
 * hotel has at least five bookable rooms (Standard, Deluxe, Premium, Family and
 * Suite). Rooms are only inserted when the (hotelId, roomNumber) pair does not
 * already exist, so running this more than once never creates duplicates and it
 * never deletes or changes existing hotels, users, rooms, or bookings.
 */
@Component
public class RoomSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RoomSeeder.class);

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public RoomSeeder(HotelRepository hotelRepository, RoomRepository roomRepository) {
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<Hotel> hotels = hotelRepository.findAll();

        if (hotels.isEmpty()) {
            log.info("RoomSeeder: no hotels found, nothing to seed.");
            return;
        }

        int inserted = 0;
        for (Hotel hotel : hotels) {
            List<Room> existing = roomRepository.findByHotelId(hotel.getHotelId());

            Set<String> existingNumbers = new HashSet<>();
            for (Room room : existing) {
                if (room.getRoomNumber() != null) {
                    existingNumbers.add(room.getRoomNumber().trim().toUpperCase());
                }
            }

            // The hotel already has at least five rooms: never add more.
            int roomCount = existing.size();
            if (roomCount >= RoomTemplate.STANDARD_SET.size()) {
                continue;
            }

            double basePrice = (hotel.getPrice() != null && hotel.getPrice() > 0)
                    ? hotel.getPrice()
                    : 1500.0;

            for (RoomTemplate template : RoomTemplate.STANDARD_SET) {
                if (roomCount >= RoomTemplate.STANDARD_SET.size()) {
                    break;
                }

                String roomNumber = template.roomNumber(hotel.getHotelId());

                // Same room number already exists for this hotel: count it once
                // and move on, so no duplicate rows are ever created.
                if (existingNumbers.contains(roomNumber.toUpperCase())) {
                    continue;
                }

                Room room = new Room();
                room.setHotelId(hotel.getHotelId());
                room.setRoomNumber(roomNumber);
                room.setRoomType(template.type);
                room.setStatus("AVAILABLE");
                room.setPrice(template.price(basePrice));
                room.setCapacity(template.capacity);
                room.setDescription(template.description);

                roomRepository.save(room);
                existingNumbers.add(roomNumber.toUpperCase());
                roomCount++;
                inserted++;
            }
        }

        if (inserted > 0) {
            log.info("RoomSeeder: inserted {} room(s) across {} hotel(s).", inserted, hotels.size());
        } else {
            log.info("RoomSeeder: all hotels already have their rooms, nothing to insert.");
        }
    }

    private static final class RoomTemplate {
        private final int index;
        private final String type;
        private final int capacity;
        private final double priceMultiplier;
        private final String description;

        private RoomTemplate(int index, String type, int capacity, double priceMultiplier, String description) {
            this.index = index;
            this.type = type;
            this.capacity = capacity;
            this.priceMultiplier = priceMultiplier;
            this.description = description;
        }

        private String roomNumber(Integer hotelId) {
            return (hotelId * 100 + 10 + index) + "";
        }

        private Double price(double basePrice) {
            return Math.round(basePrice * priceMultiplier * 100.0) / 100.0;
        }

        private static final List<RoomTemplate> STANDARD_SET = List.of(
                new RoomTemplate(0, "Standard", 2, 0.85,
                        "Comfortable Standard room with a double bed, work desk, TV and en-suite bathroom."),
                new RoomTemplate(1, "Deluxe", 3, 1.15,
                        "Spacious Deluxe room with a king bed, seating area, and upgraded amenities."),
                new RoomTemplate(2, "Premium", 2, 1.40,
                        "Premium room with premium furnishings, large bed, and relaxing ambience."),
                new RoomTemplate(3, "Family", 5, 1.60,
                        "Large Family room with multiple beds, ideal for families and small groups."),
                new RoomTemplate(4, "Suite", 4, 2.20,
                        "Luxury Suite with separate living area, bathtub, and exclusive hotel services.")
        );
    }
}