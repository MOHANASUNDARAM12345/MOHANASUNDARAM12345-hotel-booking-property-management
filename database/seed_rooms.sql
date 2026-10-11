-- ============================================================================
-- seed_rooms.sql — Idempotent room seed for every existing hotel
-- ============================================================================
-- Gives every hotel currently present in the `hotels` table at least five
-- bookable sample rooms (Standard, Deluxe, Premium, Family, Suite).
--
-- Safe to run more than once: each insert is guarded by a NOT EXISTS check on
-- (hotel_id, room_number), so no duplicates are ever created. Existing hotels,
-- users, rooms, bookings, payments and invoices are never deleted or changed.
--
-- Room number scheme (matches the RoomSeeder in the Spring Boot backend):
--   {hotel_id}10 -> Standard, {hotel_id}11 -> Deluxe,
--   {hotel_id}12 -> Premium, {hotel_id}13 -> Family,
--   {hotel_id}14 -> Suite
-- Room numbers are unique per hotel so the same seed can be used on both the
-- local and the deployed databases regardless of which hotel IDs exist.
-- ============================================================================

-- Add a description column to rooms (ignored if already present).
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS description TEXT;

-- 1. Standard rooms (capacity 2)
INSERT INTO rooms (room_number, room_type, status, price, capacity, hotel_id, description)
SELECT CAST((h.hotel_id * 100 + 10) AS VARCHAR), 'Standard', 'AVAILABLE', ROUND((CASE WHEN h.price > 0 THEN h.price ELSE 1500 END) * 0.85, 2), 2, h.hotel_id,
       'Comfortable Standard room with a double bed, work desk, TV and en-suite bathroom.'
FROM hotels h
WHERE NOT EXISTS (
    SELECT 1 FROM rooms r
    WHERE r.hotel_id = h.hotel_id
      AND UPPER(r.room_number) = UPPER(CAST((h.hotel_id * 100 + 10) AS VARCHAR))
);

-- 2. Deluxe rooms (capacity 3)
INSERT INTO rooms (room_number, room_type, status, price, capacity, hotel_id, description)
SELECT CAST((h.hotel_id * 100 + 11) AS VARCHAR), 'Deluxe', 'AVAILABLE', ROUND((CASE WHEN h.price > 0 THEN h.price ELSE 1500 END) * 1.15, 2), 3, h.hotel_id,
       'Spacious Deluxe room with a king bed, seating area, and upgraded amenities.'
FROM hotels h
WHERE NOT EXISTS (
    SELECT 1 FROM rooms r
    WHERE r.hotel_id = h.hotel_id
      AND UPPER(r.room_number) = UPPER(CAST((h.hotel_id * 100 + 11) AS VARCHAR))
);

-- 3. Premium rooms (capacity 2)
INSERT INTO rooms (room_number, room_type, status, price, capacity, hotel_id, description)
SELECT CAST((h.hotel_id * 100 + 12) AS VARCHAR), 'Premium', 'AVAILABLE', ROUND((CASE WHEN h.price > 0 THEN h.price ELSE 1500 END) * 1.40, 2), 2, h.hotel_id,
       'Premium room with premium furnishings, large bed, and relaxing ambience.'
FROM hotels h
WHERE NOT EXISTS (
    SELECT 1 FROM rooms r
    WHERE r.hotel_id = h.hotel_id
      AND UPPER(r.room_number) = UPPER(CAST((h.hotel_id * 100 + 12) AS VARCHAR))
);

-- 4. Family rooms (capacity 5)
INSERT INTO rooms (room_number, room_type, status, price, capacity, hotel_id, description)
SELECT CAST((h.hotel_id * 100 + 13) AS VARCHAR), 'Family', 'AVAILABLE', ROUND((CASE WHEN h.price > 0 THEN h.price ELSE 1500 END) * 1.60, 2), 5, h.hotel_id,
       'Large Family room with multiple beds, ideal for families and small groups.'
FROM hotels h
WHERE NOT EXISTS (
    SELECT 1 FROM rooms r
    WHERE r.hotel_id = h.hotel_id
      AND UPPER(r.room_number) = UPPER(CAST((h.hotel_id * 100 + 13) AS VARCHAR))
);

-- 5. Suite rooms (capacity 4)
INSERT INTO rooms (room_number, room_type, status, price, capacity, hotel_id, description)
SELECT CAST((h.hotel_id * 100 + 14) AS VARCHAR), 'Suite', 'AVAILABLE', ROUND((CASE WHEN h.price > 0 THEN h.price ELSE 1500 END) * 2.20, 2), 4, h.hotel_id,
       'Luxury Suite with separate living area, bathtub, and exclusive hotel services.'
FROM hotels h
WHERE NOT EXISTS (
    SELECT 1 FROM rooms r
    WHERE r.hotel_id = h.hotel_id
      AND UPPER(r.room_number) = UPPER(CAST((h.hotel_id * 100 + 14) AS VARCHAR))
);

-- Optional verification queries (uncomment to inspect results):
-- SELECT h.hotel_id, h.hotel_name, COUNT(r.room_id) AS room_count
-- FROM hotels h LEFT JOIN rooms r ON r.hotel_id = h.hotel_id
-- GROUP BY h.hotel_id, h.hotel_name ORDER BY h.hotel_id;
--
-- SELECT hotel_id, room_number, room_type, status, price, capacity
-- FROM rooms ORDER BY hotel_id, room_number;