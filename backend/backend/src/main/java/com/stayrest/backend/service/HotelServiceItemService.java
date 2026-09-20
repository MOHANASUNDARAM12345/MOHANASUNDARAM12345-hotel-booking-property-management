package com.stayrest.backend.service;

import com.stayrest.backend.entity.HotelServiceItem;
import com.stayrest.backend.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HotelServiceItemService {

    private final ServiceRepository serviceRepository;

    public HotelServiceItemService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public HotelServiceItem createService(HotelServiceItem item) {
        if (item.getIsAvailable() == null) {
            item.setIsAvailable(true);
        }
        return serviceRepository.save(item);
    }

    public List<HotelServiceItem> getAllServices() {
        return serviceRepository.findAll();
    }

    public Optional<HotelServiceItem> getServiceById(Integer id) {
        return serviceRepository.findById(id);
    }

    public List<HotelServiceItem> getServicesByHotel(Integer hotelId) {
        return serviceRepository.findByHotelId(hotelId);
    }

    public HotelServiceItem updateService(Integer id, HotelServiceItem updated) {
        HotelServiceItem existing = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service item not found with ID: " + id));

        existing.setServiceName(updated.getServiceName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setIsAvailable(updated.getIsAvailable());

        return serviceRepository.save(existing);
    }

    public void deleteService(Integer id) {
        serviceRepository.deleteById(id);
    }
}
