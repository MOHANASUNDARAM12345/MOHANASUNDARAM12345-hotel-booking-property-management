package com.stayrest.backend.security;

import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.entity.Property;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.entity.User;
import com.stayrest.backend.repository.HotelRepository;
import com.stayrest.backend.repository.PropertyRepository;
import com.stayrest.backend.repository.RoomRepository;
import com.stayrest.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Central place for server-side authorization decisions. The UI hides actions
 * based on role, but every sensitive read/write is re-checked here so a crafted
 * request can never read or mutate another user's data.
 */
@Service
public class AccessControlService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public AccessControlService(UserRepository userRepository,
                                PropertyRepository propertyRepository,
                                HotelRepository hotelRepository,
                                RoomRepository roomRepository) {
        this.userRepository = userRepository;
        this.propertyRepository = propertyRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
    }

    /**
     * Resolves the authenticated database user for the current request. The JWT
     * subject is the email, which is the Spring Security principal name.
     */
    public User requireCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new AccessDeniedException("Authentication is required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user no longer exists"));
    }

    public boolean isOwner(User user) {
        return user != null
                && user.getRole() != null
                && user.getRole().equalsIgnoreCase("OWNER");
    }

    /**
     * A booking is visible to its own guest, and to owners who manage the room
     * the booking belongs to. No other user may read it.
     */
    public boolean canAccessBooking(User user, Booking booking) {
        if (user == null || booking == null) {
            return false;
        }
        if (booking.getUserId() != null && booking.getUserId().equals(user.getUserId())) {
            return true;
        }
        return isOwner(user) && ownerManagesRoom(user, booking.getRoomId());
    }

    public void assertCanAccessBooking(User user, Booking booking) {
        if (!canAccessBooking(user, booking)) {
            throw new AccessDeniedException(
                    "You do not have permission to access this booking");
        }
    }

    /**
     * Returns true when the given room belongs to a hotel under a property owned
     * by {@code owner}.
     */
    public boolean ownerManagesRoom(User owner, Integer roomId) {
        if (!isOwner(owner) || roomId == null) {
            return false;
        }
        Room room = roomRepository.findById(roomId).orElse(null);
        if (room == null || room.getHotelId() == null) {
            return false;
        }
        return ownerManagesHotel(owner, room.getHotelId());
    }

    public boolean ownerManagesHotel(User owner, Integer hotelId) {
        if (!isOwner(owner) || hotelId == null) {
            return false;
        }
        Hotel hotel = hotelRepository.findById(hotelId).orElse(null);
        if (hotel == null || hotel.getPropertyId() == null) {
            return false;
        }
        return ownerPropertyIds(owner).contains(hotel.getPropertyId());
    }

    public Set<Integer> ownerPropertyIds(User owner) {
        List<Property> properties = propertyRepository.findByOwnerId(owner.getUserId());
        Set<Integer> ids = new HashSet<>();
        for (Property property : properties) {
            ids.add(property.getPropertyId());
        }
        return ids;
    }
}
