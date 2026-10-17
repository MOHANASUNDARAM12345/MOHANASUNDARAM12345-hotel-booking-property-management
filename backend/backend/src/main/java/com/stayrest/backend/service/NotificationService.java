package com.stayrest.backend.service;

import com.stayrest.backend.constants.NotificationType;
import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.entity.Hotel;
import com.stayrest.backend.entity.Notification;
import com.stayrest.backend.entity.Payment;
import com.stayrest.backend.entity.Property;
import com.stayrest.backend.entity.Room;
import com.stayrest.backend.repository.HotelRepository;
import com.stayrest.backend.repository.NotificationRepository;
import com.stayrest.backend.repository.PropertyRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final HotelRepository hotelRepository;
    private final PropertyRepository propertyRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               HotelRepository hotelRepository,
                               PropertyRepository propertyRepository) {
        this.notificationRepository = notificationRepository;
        this.hotelRepository = hotelRepository;
        this.propertyRepository = propertyRepository;
    }

    // ------------------------------------------------------------------
    // Core CRUD
    // ------------------------------------------------------------------

    public Notification createNotification(Notification notification) {
        if (notification.getIsRead() == null) {
            notification.setIsRead(false);
        }
        return notificationRepository.save(notification);
    }

    /**
     * Creates a notification for a specific user. Every notification that
     * reaches the database goes through this method (or the event helpers
     * below) so type, defaults, and ownership columns are always populated.
     */
    public Notification create(Integer userId,
                               String type,
                               String title,
                               String message,
                               String actionLink,
                               String actionLabel,
                               Integer relatedBookingId) {
        if (userId == null) {
            throw new IllegalArgumentException("A notification must belong to a user");
        }
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setActionLink(actionLink);
        notification.setActionLabel(actionLabel);
        notification.setRelatedBookingId(relatedBookingId);
        notification.setIsRead(false);
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotificationsByUser(Integer userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Notification> getNotificationById(Integer id) {
        return notificationRepository.findById(id);
    }

    public long getUnreadCount(Integer userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    /**
     * Marks a single notification read, but only when it belongs to
     * {@code userId}. Any other user is rejected so one account can never
     * mutate another account's notifications.
     */
    public Notification markAsRead(Integer id, Integer userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));

        assertOwnership(notification, userId);

        if (!Boolean.TRUE.equals(notification.getIsRead())) {
            notification.setIsRead(true);
            notification = notificationRepository.save(notification);
        }
        return notification;
    }

    public int markAllAsRead(Integer userId) {
        return notificationRepository.markAllReadByUserId(userId);
    }

    public void deleteNotification(Integer id, Integer userId) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with ID: " + id));

        assertOwnership(notification, userId);
        notificationRepository.delete(notification);
    }

    private void assertOwnership(Notification notification, Integer userId) {
        if (userId == null || !userId.equals(notification.getUserId())) {
            throw new AccessDeniedException("You do not have permission to access this notification");
        }
    }

    // ------------------------------------------------------------------
    // Event helpers - only invoked from real application events
    // ------------------------------------------------------------------

    /** Emitted when a guest places a booking; also alerts the property owner. */
    public void notifyBookingPlaced(Booking booking, Room room) {
        if (booking == null || booking.getUserId() == null) {
            return;
        }
        long nights = nights(booking);
        String reference = "#" + booking.getBookingId();
        create(
                booking.getUserId(),
                NotificationType.BOOKING,
                "Booking Received",
                "Your booking " + reference + " for " + nights + " night(s) has been received and is awaiting payment.",
                "/my-bookings",
                "View Booking",
                booking.getBookingId()
        );

        Integer ownerId = resolveOwnerId(room);
        if (ownerId != null && !ownerId.equals(booking.getUserId())) {
            create(
                    ownerId,
                    NotificationType.OWNER_BOOKING,
                    "New Booking Received",
                    "A new booking " + reference + " was placed for " + roomLabel(room)
                            + " (" + nights + " night(s)).",
                    "/owner",
                    "Open Owner Panel",
                    booking.getBookingId()
            );
        }
    }

    /** Emitted after a payment is recorded and the booking is confirmed. */
    public void notifyBookingConfirmed(Booking booking, Payment payment) {
        if (booking == null || booking.getUserId() == null) {
            return;
        }
        create(
                booking.getUserId(),
                NotificationType.BOOKING,
                "Booking Confirmed",
                "Your booking #" + booking.getBookingId() + " is confirmed. "
                        + "We look forward to hosting you.",
                "/my-bookings",
                "View Booking",
                booking.getBookingId()
        );

        String status = payment.getPaymentStatus() != null ? payment.getPaymentStatus() : "COMPLETED";
        create(
                booking.getUserId(),
                NotificationType.PAYMENT,
                "Payment " + status,
                "A payment of " + money(payment.getAmount()) + " for booking #"
                        + booking.getBookingId() + " was recorded"
                        + (payment.getTransactionId() != null
                                ? " (transaction " + payment.getTransactionId() + ")."
                                : "."),
                "/my-bookings",
                "View Invoice",
                booking.getBookingId()
        );
    }

    /**
     * Emitted when a booking is cancelled. Includes the refund the guest is
     * eligible for (computed from the cancellation policy); a separate REFUND
     * notification is only created when a refund is actually due. The property
     * owner is alerted as well.
     */
    public void notifyBookingCancelled(Booking booking,
                                       Room room,
                                       Double refundAmount,
                                       Double refundPercentage) {
        if (booking == null || booking.getUserId() == null) {
            return;
        }
        String reference = "#" + booking.getBookingId();
        create(
                booking.getUserId(),
                NotificationType.CANCELLATION,
                "Booking Cancelled",
                "Your booking " + reference + " has been cancelled.",
                "/my-bookings",
                "View Bookings",
                booking.getBookingId()
        );

        if (refundAmount != null && refundAmount > 0) {
            double percentage = refundPercentage != null ? refundPercentage : 0.0;
            create(
                    booking.getUserId(),
                    NotificationType.REFUND,
                    "Refund Eligible",
                    "You are eligible for a refund of " + money(refundAmount)
                            + " (" + formatPercentage(percentage)
                            + " of the booking total) for cancelled booking " + reference
                            + ". Refunds follow our cancellation policy.",
                    "/my-bookings",
                    "View Bookings",
                    booking.getBookingId()
            );
        }

        Integer ownerId = resolveOwnerId(room);
        if (ownerId != null && !ownerId.equals(booking.getUserId())) {
            create(
                    ownerId,
                    NotificationType.OWNER_BOOKING,
                    "Booking Cancelled",
                    "Booking " + reference + " for " + roomLabel(room) + " was cancelled.",
                    "/owner",
                    "Open Owner Panel",
                    booking.getBookingId()
            );
        }
    }

    /** Emitted when a stay is completed / checked out. */
    public void notifyBookingCompleted(Booking booking) {
        if (booking == null || booking.getUserId() == null) {
            return;
        }
        create(
                booking.getUserId(),
                NotificationType.BOOKING,
                "Stay Completed",
                "We hope you enjoyed your stay. Booking #" + booking.getBookingId()
                        + " is now complete.",
                "/my-bookings",
                "Leave a Review",
                booking.getBookingId()
        );
    }

    /**
     * Emitted by the scheduled check-in reminder. Idempotent: a booking only
     * ever receives one check-in reminder.
     */
    public Notification notifyCheckInReminder(Booking booking) {
        if (booking == null || booking.getUserId() == null) {
            return null;
        }
        if (notificationRepository.existsByUserIdAndTypeAndRelatedBookingId(
                booking.getUserId(), NotificationType.CHECKIN_REMINDER, booking.getBookingId())) {
            return null;
        }
        return create(
                booking.getUserId(),
                NotificationType.CHECKIN_REMINDER,
                "Check-in Tomorrow",
                "Your stay begins tomorrow (" + booking.getCheckInDate()
                        + "). Have your booking #" + booking.getBookingId() + " ready.",
                "/my-bookings",
                "View Booking",
                booking.getBookingId()
        );
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    /**
     * Walks room -> hotel -> property to find the owner who manages a room.
     * Returns {@code null} when any link in the chain is missing, so callers
     * can simply skip owner notifications.
     */
    public Integer resolveOwnerId(Room room) {
        if (room == null || room.getHotelId() == null) {
            return null;
        }
        Hotel hotel = hotelRepository.findById(room.getHotelId()).orElse(null);
        if (hotel == null || hotel.getPropertyId() == null) {
            return null;
        }
        Property property = propertyRepository.findById(hotel.getPropertyId()).orElse(null);
        return property != null ? property.getOwnerId() : null;
    }

    private String roomLabel(Room room) {
        if (room == null) {
            return "your property";
        }
        if (room.getRoomNumber() != null) {
            return "room " + room.getRoomNumber();
        }
        return "your property";
    }

    private long nights(Booking booking) {
        if (booking.getCheckInDate() == null || booking.getCheckOutDate() == null) {
            return 1;
        }
        return Math.max(ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate()), 1);
    }

    private String money(Double amount) {
        double value = amount != null ? amount : 0.0;
        return String.format("₹%.2f", value);
    }

    private String formatPercentage(double percentage) {
        if (percentage == Math.rint(percentage)) {
            return String.format("%.0f%%", percentage);
        }
        return String.format("%.1f%%", percentage);
    }
}
