package com.stayrest.backend.service;

import com.stayrest.backend.entity.HotelStaff;
import com.stayrest.backend.repository.HotelStaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelStaffService {

    private final HotelStaffRepository hotelStaffRepository;

    public HotelStaffService(HotelStaffRepository hotelStaffRepository) {
        this.hotelStaffRepository = hotelStaffRepository;
    }

    public HotelStaff createStaff(HotelStaff staff) {
        return hotelStaffRepository.save(staff);
    }

    public List<HotelStaff> getAllStaff() {
        return hotelStaffRepository.findAll();
    }

    public Optional<HotelStaff> getStaffById(Integer id) {
        return hotelStaffRepository.findById(id);
    }

    public List<HotelStaff> getStaffByHotel(Integer hotelId) {
        return hotelStaffRepository.findByHotelId(hotelId);
    }

    public HotelStaff updateStaff(Integer id, HotelStaff updated) {
        HotelStaff existing = hotelStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff member not found with ID: " + id));

        existing.setName(updated.getName());
        existing.setRole(updated.getRole());
        existing.setPhone(updated.getPhone());
        existing.setEmail(updated.getEmail());

        return hotelStaffRepository.save(existing);
    }

    public void deleteStaff(Integer id) {
        hotelStaffRepository.deleteById(id);
    }
}
