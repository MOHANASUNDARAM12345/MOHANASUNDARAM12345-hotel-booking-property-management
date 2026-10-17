package com.stayrest.backend.service;

import com.stayrest.backend.constants.BookingStatus;
import com.stayrest.backend.entity.Booking;
import com.stayrest.backend.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Reliable scheduled checks that emit notifications the application cannot
 * derive from a single request. Currently this sends a one-time check-in
 * reminder for confirmed bookings starting the next day.
 */
@Component
public class NotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public NotificationScheduler(BookingRepository bookingRepository,
                                 NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    /** Runs every day at 06:00 server time. */
    @Scheduled(cron = "${notifications.checkin-reminder.cron:0 0 6 * * *}")
    public void sendCheckInReminders() {
        int created = sendCheckInReminders(LocalDate.now().plusDays(1));
        if (created > 0) {
            log.info("Sent {} check-in reminder notification(s)", created);
        }
    }

    /**
     * Emits reminders for every confirmed booking checking in on
     * {@code checkInDate}. Idempotent thanks to the dedupe guard in
     * {@link NotificationService}. Returns the number of reminders created.
     */
    public int sendCheckInReminders(LocalDate checkInDate) {
        List<Booking> bookings = bookingRepository.findByCheckInDate(checkInDate);
        int created = 0;
        for (Booking booking : bookings) {
            if (booking.getStatus() == null
                    || !BookingStatus.CONFIRMED.equalsIgnoreCase(booking.getStatus())) {
                continue;
            }
            if (notificationService.notifyCheckInReminder(booking) != null) {
                created++;
            }
        }
        return created;
    }
}
