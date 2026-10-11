package com.stayrest.backend.service;

import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.BookingRepository;
import com.stayrest.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public RoomService(RoomRepository roomRepository,
                       BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    @Transactional(readOnly = true)
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Room> getRoomById(Integer roomId) {
        return roomRepository.findById(roomId);
    }

    @Transactional(readOnly = true)
    public List<Room> getRoomsByHotel(Integer hotelId) {
        return roomRepository.findByHotelId(hotelId);
    }

    /**
     * Returns the rooms of a hotel that are actually bookable for the given
     * date range. A room is excluded when:
     * <ul>
     *   <li>it is under maintenance / out of service (operational status), or</li>
     *   <li>it has any non-cancelled overlapping booking for the requested dates.</li>
     * </ul>
     * This check is done server-side on the database, so the frontend can never
     * overstate availability.
     */
    @Transactional(readOnly = true)
    public List<Room> getAvailableRoomsByHotel(Integer hotelId, LocalDate checkIn, LocalDate checkOut, Integer guests) {
        LocalDate effectiveCheckIn = checkIn != null ? checkIn : LocalDate.now();
        LocalDate effectiveCheckOut = checkOut != null ? checkOut : effectiveCheckIn.plusDays(1);

        if (!effectiveCheckIn.isBefore(effectiveCheckOut)) {
            throw new IllegalArgumentException("Check-in date must be before check-out date");
        }

        Set<Integer> bookedRoomIds = bookingRepository
                .findOverlappingBookings(effectiveCheckIn, effectiveCheckOut)
                .stream()
                .map(Booking::getRoomId)
                .collect(Collectors.toSet());

        return roomRepository.findByHotelId(hotelId).stream()
                .filter(room -> !isOutOfService(room.getStatus()))
                .filter(room -> !bookedRoomIds.contains(room.getRoomId()))
                .filter(room -> guests == null || guests <= 0 || room.getCapacity() == null
                        || room.getCapacity() >= guests)
                .collect(Collectors.toList());
    }

    private boolean isOutOfService(String status) {
        if (status == null) {
            return false;
        }
        String upper = status.toUpperCase();
        return upper.contains("MAINTENANCE")
                || upper.contains("OUT_OF_SERVICE")
                || upper.contains("OUT OF SERVICE");
    }

    public Room updateRoom(Integer roomId, Room updatedRoom) {

        Room existingRoom = roomRepository
                .findById(roomId)
                .orElseThrow(() ->
                        new RuntimeException("Room not found"));

        existingRoom.setRoomNumber(
                updatedRoom.getRoomNumber()
        );

        existingRoom.setRoomType(
                updatedRoom.getRoomType()
        );

        existingRoom.setStatus(
                updatedRoom.getStatus()
        );

        existingRoom.setPrice(
                updatedRoom.getPrice()
        );

        existingRoom.setCapacity(
                updatedRoom.getCapacity()
        );

        existingRoom.setHotelId(
                updatedRoom.getHotelId()
        );

        existingRoom.setImageUrl(
                updatedRoom.getImageUrl()
        );

        existingRoom.setDescription(
                updatedRoom.getDescription()
        );

        return roomRepository.save(existingRoom);
    }

    public void deleteRoom(Integer roomId) {
        roomRepository.deleteById(roomId);
    }
}