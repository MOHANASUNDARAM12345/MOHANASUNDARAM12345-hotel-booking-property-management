package com.stayrest.backend.controller;

import com.stayrest.backend.constants.NotificationType;
import com.stayrest.backend.entity.Notification;
import com.stayrest.backend.entity.User;
import com.stayrest.backend.security.AccessControlService;
import com.stayrest.backend.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private static final String FILTER_ALL = "all";
    private static final String FILTER_UNREAD = "unread";
    private static final String FILTER_BOOKINGS = "bookings";
    private static final String FILTER_PAYMENTS = "payments";

    /** Booking-related categories shown by the "Bookings" filter. */
    private static final Set<String> BOOKING_TYPES = Set.of(
            NotificationType.BOOKING,
            NotificationType.CANCELLATION,
            NotificationType.CHECKIN_REMINDER,
            NotificationType.OWNER_BOOKING
    );

    /** Payment-related categories shown by the "Payments" filter. */
    private static final Set<String> PAYMENT_TYPES = Set.of(
            NotificationType.PAYMENT,
            NotificationType.REFUND
    );

    private final NotificationService notificationService;
    private final AccessControlService accessControlService;

    public NotificationController(NotificationService notificationService,
                                  AccessControlService accessControlService) {
        this.notificationService = notificationService;
        this.accessControlService = accessControlService;
    }

    /**
     * Returns the signed-in user's notifications, optionally filtered. The
     * user id always comes from the JWT principal, never from the client, so a
     * caller can only ever see their own notifications.
     */
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(
            @RequestParam(name = "filter", required = false, defaultValue = FILTER_ALL) String filter,
            Authentication authentication) {

        Integer userId = currentUserId(authentication);
        List<Notification> notifications = notificationService.getNotificationsByUser(userId)
                .stream()
                .filter(notification -> matchesFilter(notification, filter))
                .toList();

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        Integer userId = currentUserId(authentication);
        return ResponseEntity.ok(Map.of("count", notificationService.getUnreadCount(userId)));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Integer id,
                                                   Authentication authentication) {
        Integer userId = currentUserId(authentication);
        return ResponseEntity.ok(notificationService.markAsRead(id, userId));
    }

    @PutMapping("/read-all")
    public ResponseEntity<Map<String, Integer>> markAllAsRead(Authentication authentication) {
        Integer userId = currentUserId(authentication);
        int updated = notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("updated", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable Integer id,
                                                                  Authentication authentication) {
        Integer userId = currentUserId(authentication);
        notificationService.deleteNotification(id, userId);
        return ResponseEntity.ok(Map.of("message", "Notification deleted successfully"));
    }

    private Integer currentUserId(Authentication authentication) {
        User user = accessControlService.requireCurrentUser(authentication);
        return user.getUserId();
    }

    private boolean matchesFilter(Notification notification, String filter) {
        String normalized = filter == null ? FILTER_ALL : filter.trim().toLowerCase(Locale.ROOT);

        return switch (normalized) {
            case FILTER_UNREAD -> !Boolean.TRUE.equals(notification.getIsRead());
            case FILTER_BOOKINGS -> notification.getType() != null
                    && BOOKING_TYPES.contains(notification.getType().toUpperCase(Locale.ROOT));
            case FILTER_PAYMENTS -> notification.getType() != null
                    && PAYMENT_TYPES.contains(notification.getType().toUpperCase(Locale.ROOT));
            default -> true;
        };
    }
}
