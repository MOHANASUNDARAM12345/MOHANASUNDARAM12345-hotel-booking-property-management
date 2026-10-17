package com.stayrest.backend.repository;

import com.stayrest.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByUserIdOrderByCreatedAtDesc(Integer userId);

    /**
     * Counts unread notifications for a user. Rows created before the
     * {@code is_read} default was introduced can hold {@code NULL}, which is
     * treated as unread here.
     */
    @Query("SELECT COUNT(n) FROM Notification n "
            + "WHERE n.userId = :userId AND (n.isRead = false OR n.isRead IS NULL)")
    long countUnreadByUserId(@Param("userId") Integer userId);

    /**
     * Marks every notification for the user as read in a single statement.
     * Returns the number of rows updated.
     */
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true "
            + "WHERE n.userId = :userId AND (n.isRead = false OR n.isRead IS NULL)")
    int markAllReadByUserId(@Param("userId") Integer userId);

    /**
     * Deduplication guard for scheduled reminders: true when this exact
     * category has already been emitted for the given booking.
     */
    boolean existsByUserIdAndTypeAndRelatedBookingId(
            Integer userId, String type, Integer relatedBookingId);
}
