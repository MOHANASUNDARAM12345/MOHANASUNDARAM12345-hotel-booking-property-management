package com.stayrest.backend.repository;

import com.stayrest.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUserId(Integer userId);

    List<Booking> findByRoomId(Integer roomId);

    /**
     * Finds bookings for a single room that would overlap [checkInDate, checkOutDate).
     * Only bookings that are active (not cancelled / checked out) are considered.
     * The pessimistic write lock serializes concurrent creation of overlapping
     * bookings for the same room and prevents double booking.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b WHERE b.roomId = :roomId AND UPPER(COALESCE(b.status, 'PENDING')) NOT IN ('CANCELLED', 'CHECKED_OUT', 'COMPLETED') AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate")
    List<Booking> findOverlappingBookings(
            @Param("roomId") Integer roomId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );

    /**
     * Finds every active booking across all rooms that overlaps
     * [checkInDate, checkOutDate). Used to compute per-hotel availability
     * for the given dates.
     */
    @Query("SELECT b FROM Booking b WHERE UPPER(COALESCE(b.status, 'PENDING')) NOT IN ('CANCELLED', 'CHECKED_OUT', 'COMPLETED') AND b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate")
    List<Booking> findOverlappingBookings(
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate
    );
}