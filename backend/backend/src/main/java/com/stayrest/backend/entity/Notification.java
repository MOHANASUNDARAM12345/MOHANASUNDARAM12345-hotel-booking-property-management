package com.stayrest.backend.entity;

import com.stayrest.backend.constants.NotificationType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Integer notificationId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "title", nullable = false, length = 120)
    private String title;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    /**
     * Category used by the UI filters (see {@link NotificationType}). Stored as
     * a plain string so legacy rows with other values keep working.
     */
    @Column(name = "type", length = 50)
    private String type;

    /** Relative in-app link the user can follow, e.g. {@code /my-bookings}. */
    @Column(name = "action_link", length = 255)
    private String actionLink;

    /** Short call-to-action label shown on the action link. */
    @Column(name = "action_label", length = 60)
    private String actionLabel;

    /**
     * Optional booking this notification refers to. Used to prevent duplicate
     * scheduled reminders for the same booking.
     */
    @Column(name = "related_booking_id")
    private Integer relatedBookingId;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Notification() {
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (isRead == null) {
            isRead = false;
        }
    }

    public Integer getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Integer notificationId) {
        this.notificationId = notificationId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getActionLink() {
        return actionLink;
    }

    public void setActionLink(String actionLink) {
        this.actionLink = actionLink;
    }

    public String getActionLabel() {
        return actionLabel;
    }

    public void setActionLabel(String actionLabel) {
        this.actionLabel = actionLabel;
    }

    public Integer getRelatedBookingId() {
        return relatedBookingId;
    }

    public void setRelatedBookingId(Integer relatedBookingId) {
        this.relatedBookingId = relatedBookingId;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
