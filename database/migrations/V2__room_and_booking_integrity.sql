-- ============================================================================
-- V2__room_and_booking_integrity.sql
-- Data-integrity hardening for rooms and bookings.
-- Safe to run repeatedly: every statement is idempotent.
-- ============================================================================

-- A room number must be unique within each hotel. The application already
-- avoids inserting duplicates; this index makes it impossible at the database
-- level too.
CREATE UNIQUE INDEX IF NOT EXISTS uq_rooms_hotel_room_number
    ON rooms (hotel_id, room_number);

-- Speed up room availability / overlap queries.
CREATE INDEX IF NOT EXISTS idx_bookings_room_dates
    ON bookings (room_id, check_in_date, check_out_date);

-- Speed up "my bookings" queries.
CREATE INDEX IF NOT EXISTS idx_bookings_user
    ON bookings (user_id);

-- Checkout must always come after check-in.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_bookings_checkout_after_checkin'
    ) THEN
        ALTER TABLE bookings
            ADD CONSTRAINT chk_bookings_checkout_after_checkin
            CHECK (check_out_date > check_in_date);
    END IF;
END $$;

-- A room fee cannot be negative.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_rooms_price_non_negative'
    ) THEN
        ALTER TABLE rooms
            ADD CONSTRAINT chk_rooms_price_non_negative
            CHECK (price IS NULL OR price >= 0);
    END IF;
END $$;