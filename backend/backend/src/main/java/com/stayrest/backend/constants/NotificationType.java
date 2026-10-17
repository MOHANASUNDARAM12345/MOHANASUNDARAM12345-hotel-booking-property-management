package com.stayrest.backend.constants;

/**
 * Canonical notification category values stored in
 * {@code notifications.type}. Each category groups notifications so the UI can
 * offer All / Unread / Bookings / Payments filters without parsing free text.
 */
public final class NotificationType {

    /** Booking lifecycle updates for the guest (placed, confirmed, completed). */
    public static final String BOOKING = "BOOKING";

    /** Payment lifecycle updates for the guest. */
    public static final String PAYMENT = "PAYMENT";

    /** Booking cancellation updates for the guest. */
    public static final String CANCELLATION = "CANCELLATION";

    /** Refund eligibility updates (only emitted when a refund is actually due). */
    public static final String REFUND = "REFUND";

    /** Scheduled reminder that a confirmed stay starts within 24 hours. */
    public static final String CHECKIN_REMINDER = "CHECKIN_REMINDER";

    /** Booking activity for the property owner who manages the room. */
    public static final String OWNER_BOOKING = "OWNER_BOOKING";

    private NotificationType() {
    }
}
