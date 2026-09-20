package com.stayrest.backend.service;

import com.stayrest.backend.entity.HotelImage;
import com.stayrest.backend.repository.HotelImageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelImageService {

    private final HotelImageRepository hotelImageRepository;

    public HotelImageService(HotelImageRepository hotelImageRepository) {
        this.hotelImageRepository = hotelImageRepository;
    }

    public HotelImage addImage(HotelImage image) {
        return hotelImageRepository.save(image);
    }

    public List<HotelImage> getImagesByHotel(Integer hotelId) {
        return hotelImageRepository.findByHotelId(hotelId);
    }

    public Optional<HotelImage> getImageById(Integer id) {
        return hotelImageRepository.findById(id);
    }

    public void deleteImage(Integer id) {
        hotelImageRepository.deleteById(id);
    }
}
