package com.stayrest.backend.service;

import com.stayrest.backend.entity.HotelDetail;
import com.stayrest.backend.repository.HotelDetailRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelDetailService {

    private final HotelDetailRepository hotelDetailRepository;

    public HotelDetailService(HotelDetailRepository hotelDetailRepository) {
        this.hotelDetailRepository = hotelDetailRepository;
    }

    public HotelDetail saveOrUpdateHotelDetail(HotelDetail detail) {
        Optional<HotelDetail> existing = hotelDetailRepository.findByHotelId(detail.getHotelId());
        if (existing.isPresent()) {
            HotelDetail d = existing.get();
            d.setCheckInTime(detail.getCheckInTime());
            d.setCheckOutTime(detail.getCheckOutTime());
            d.setPolicies(detail.getPolicies());
            d.setAmenities(detail.getAmenities());
            d.setContactEmail(detail.getContactEmail());
            d.setContactPhone(detail.getContactPhone());
            return hotelDetailRepository.save(d);
        }
        return hotelDetailRepository.save(detail);
    }

    public List<HotelDetail> getAllHotelDetails() {
        return hotelDetailRepository.findAll();
    }

    public Optional<HotelDetail> getHotelDetailByHotel(Integer hotelId) {
        return hotelDetailRepository.findByHotelId(hotelId);
    }

    public Optional<HotelDetail> getHotelDetailById(Integer id) {
        return hotelDetailRepository.findById(id);
    }

    public void deleteHotelDetail(Integer id) {
        hotelDetailRepository.deleteById(id);
    }
}
