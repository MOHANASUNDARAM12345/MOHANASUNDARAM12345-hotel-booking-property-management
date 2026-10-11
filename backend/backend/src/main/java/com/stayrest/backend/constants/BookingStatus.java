package com.stayrest.backend.constants;

/**
 * Canonical booking status values stored in the {@code bookings.status} column.
 * Keeping them in one place prevents typos and diverging strings between the
 * service layer and analytics logic.
 */
public final class BookingStatus {

    public static final String PENDING = "PENDING";
    public static final String CONFIRMED = "CONFIRMED";
    public static final String CANCELLED = "CANCELLED";
    public static final String CHECKED_IN = "CHECKED_IN";
    public static final String CHECKED_OUT = "CHECKED_OUT";
    public static final String COMPLETED = "COMPLETED";

    private BookingStatus() {
    }
}