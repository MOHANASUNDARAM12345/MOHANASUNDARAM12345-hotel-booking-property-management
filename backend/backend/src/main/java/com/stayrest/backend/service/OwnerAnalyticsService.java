package com.stayrest.backend.service;

import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.entity.Property;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.HotelRepository;
import com.stayrest.backend.repository.PropertyRepository;
import com.stayrest.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class OwnerAnalyticsService {

    private final PropertyRepository propertyRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public OwnerAnalyticsService(PropertyRepository propertyRepository,
                                 HotelRepository hotelRepository,
                                 RoomRepository roomRepository,
                                 BookingRepository bookingRepository) {
        this.propertyRepository = propertyRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    public static class OwnerAnalyticsResponse {
        private int totalProperties;
        private int totalHotels;
        private int totalRooms;
        private double totalRevenue;
        private int totalBookings;
        private int confirmedBookings;
        private int pendingBookings;
        private int cancelledBookings;
        private double occupancyRate;
        private int upcomingArrivals;
        private List<Map<String, Object>> recentBookingsSummary;

        public int getTotalProperties() { return totalProperties; }
        public void setTotalProperties(int totalProperties) { this.totalProperties = totalProperties; }

        public int getTotalHotels() { return totalHotels; }
        public void setTotalHotels(int totalHotels) { this.totalHotels = totalHotels; }

        public int getTotalRooms() { return totalRooms; }
        public void setTotalRooms(int totalRooms) { this.totalRooms = totalRooms; }

        public double getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

        public int getTotalBookings() { return totalBookings; }
        public void setTotalBookings(int totalBookings) { this.totalBookings = totalBookings; }

        public int getConfirmedBookings() { return confirmedBookings; }
        public void setConfirmedBookings(int confirmedBookings) { this.confirmedBookings = confirmedBookings; }

        public int getPendingBookings() { return pendingBookings; }
        public void setPendingBookings(int pendingBookings) { this.pendingBookings = pendingBookings; }

        public int getCancelledBookings() { return cancelledBookings; }
        public void setCancelledBookings(int cancelledBookings) { this.cancelledBookings = cancelledBookings; }

        public double getOccupancyRate() { return occupancyRate; }
        public void setOccupancyRate(double occupancyRate) { this.occupancyRate = occupancyRate; }

        public int getUpcomingArrivals() { return upcomingArrivals; }
        public void setUpcomingArrivals(int upcomingArrivals) { this.upcomingArrivals = upcomingArrivals; }

        public List<Map<String, Object>> getRecentBookingsSummary() { return recentBookingsSummary; }
        public void setRecentBookingsSummary(List<Map<String, Object>> recentBookingsSummary) { this.recentBookingsSummary = recentBookingsSummary; }
    }

    public OwnerAnalyticsResponse getAnalytics(Integer ownerId) {
        List<Property> properties = ownerId != null ? propertyRepository.findByOwnerId(ownerId) : propertyRepository.findAll();
        List<Integer> propertyIds = properties.stream().map(Property::getPropertyId).toList();

        List<Hotel> hotels = new ArrayList<>();
        for (Integer pid : propertyIds) {
            hotels.addAll(hotelRepository.findByPropertyId(pid));
        }

        // If no properties/hotels found for this owner, fallback to all hotels for demo
        if (hotels.isEmpty()) {
            hotels = hotelRepository.findAll();
        }

        List<Integer> hotelIds = hotels.stream().map(Hotel::getHotelId).toList();
        List<Room> rooms = new ArrayList<>();
        for (Integer hid : hotelIds) {
            rooms.addAll(roomRepository.findByHotelId(hid));
        }

        List<Integer> roomIds = rooms.stream().map(Room::getRoomId).toList();
        Set<Integer> roomIdSet = new HashSet<>(roomIds);

        List<Booking> allBookings = bookingRepository.findAll();
        List<Booking> ownerBookings = allBookings.stream()
                .filter(b -> roomIdSet.isEmpty() || roomIdSet.contains(b.getRoomId()))
                .toList();

        double totalRev = 0.0;
        int confirmed = 0;
        int pending = 0;
        int cancelled = 0;
        int upcoming = 0;
        LocalDate today = LocalDate.now();

        List<Map<String, Object>> recentSummary = new ArrayList<>();

        for (Booking b : ownerBookings) {
            if ("CONFIRMED".equalsIgnoreCase(b.getStatus()) || "COMPLETED".equalsIgnoreCase(b.getStatus())) {
                confirmed++;
                totalRev += (b.getTotalAmount() != null ? b.getTotalAmount() : 0.0);
            } else if ("PENDING".equalsIgnoreCase(b.getStatus())) {
                pending++;
            } else if ("CANCELLED".equalsIgnoreCase(b.getStatus())) {
                cancelled++;
            }

            if (b.getCheckInDate() != null && !b.getCheckInDate().isBefore(today) && !"CANCELLED".equalsIgnoreCase(b.getStatus())) {
                upcoming++;
            }

            Map<String, Object> summaryItem = new HashMap<>();
            summaryItem.put("bookingId", b.getBookingId());
            summaryItem.put("roomId", b.getRoomId());
            summaryItem.put("checkInDate", b.getCheckInDate());
            summaryItem.put("checkOutDate", b.getCheckOutDate());
            summaryItem.put("guests", b.getGuests());
            summaryItem.put("status", b.getStatus());
            summaryItem.put("totalAmount", b.getTotalAmount());
            recentSummary.add(summaryItem);
        }

        double occupancy = rooms.isEmpty() ? 0.0 : (double) confirmed / Math.max(1, rooms.size()) * 100.0;
        occupancy = Math.min(100.0, Math.round(occupancy * 10.0) / 10.0);

        OwnerAnalyticsResponse resp = new OwnerAnalyticsResponse();
        resp.setTotalProperties(properties.size());
        resp.setTotalHotels(hotels.size());
        resp.setTotalRooms(rooms.size());
        resp.setTotalRevenue(totalRev);
        resp.setTotalBookings(ownerBookings.size());
        resp.setConfirmedBookings(confirmed);
        resp.setPendingBookings(pending);
        resp.setCancelledBookings(cancelled);
        resp.setOccupancyRate(occupancy);
        resp.setUpcomingArrivals(upcoming);
        resp.setRecentBookingsSummary(recentSummary);

        return resp;
    }
}
