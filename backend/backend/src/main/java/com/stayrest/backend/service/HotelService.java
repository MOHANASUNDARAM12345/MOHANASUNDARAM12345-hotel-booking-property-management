package com.stayrest.backend.service;

import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;

    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    // Create hotel
    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    // Get all hotels
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    // Get hotel by ID
    public Optional<Hotel> getHotelById(Integer hotelId) {
        return hotelRepository.findById(hotelId);
    }

    // Get hotels by property
    public List<Hotel> getHotelsByProperty(Integer propertyId) {
        return hotelRepository.findByPropertyId(propertyId);
    }

    // Update hotel
    public Hotel updateHotel(Integer hotelId, Hotel updatedHotel) {

        Hotel existingHotel = hotelRepository
                .findById(hotelId)
                .orElseThrow(() ->
                        new RuntimeException("Hotel not found"));

        existingHotel.setPropertyId(
                updatedHotel.getPropertyId()
        );

        existingHotel.setHotelName(
                updatedHotel.getHotelName()
        );

        existingHotel.setLocation(
                updatedHotel.getLocation()
        );

        existingHotel.setDescription(
                updatedHotel.getDescription()
        );

        existingHotel.setRating(
                updatedHotel.getRating()
        );

        existingHotel.setPrice(
                updatedHotel.getPrice()
        );

        existingHotel.setCategory(
                updatedHotel.getCategory()
        );

        existingHotel.setImageUrl(
                updatedHotel.getImageUrl()
        );

        return hotelRepository.save(existingHotel);
    }

    // Delete hotel
    public void deleteHotel(Integer hotelId) {
        hotelRepository.deleteById(hotelId);
    }
}