-- Query 1: USERS Table
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query 2: PROPERTIES Table
CREATE TABLE properties(
    property_id SERIAL PRIMARY KEY,
    owner_id INT NOT NULL,
    property_name VARCHAR(100) NOT NULL,
    property_type VARCHAR(50),
    description TEXT,
    address TEXT,
    city VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

-- Query 3: HOTELS Table
CREATE TABLE hotels(
    hotel_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL,
    hotel_name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    description TEXT,
    rating DECIMAL(2,1),
    price DECIMAL(10,2),
    category VARCHAR(50),
    image_url TEXT,
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

-- Query 4: HOTEL_STAFF Table
CREATE TABLE hotel_staff (
    staff_id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    position VARCHAR(50),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- Query 5: ROOMS Table
CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(50),
    status VARCHAR(30),
    price DECIMAL(10,2),
    capacity INT,
    hotel_id INT NOT NULL,
    image_url TEXT,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- Query 6: HOTEL_IMAGES Table
CREATE TABLE hotel_images (
    image_id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL,
    image_url TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- Query 7: ROOM_TYPES Table
CREATE TABLE room_types (
    room_type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    description TEXT,
    max_capacity INT
);

-- Query 8: HOTEL_DETAILS Table
CREATE TABLE hotel_details (
    hotel_details_id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL UNIQUE,
    check_in_time TIME,
    check_out_time TIME,
    contact VARCHAR(15),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- Query 9: SKILLS Table
CREATE TABLE skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Query 10: BOOKINGS Table
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    booking_date DATE DEFAULT CURRENT_DATE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INT,
    status VARCHAR(30),
    total_amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- Query 11: PAYMENTS Table
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(30),
    bank_name VARCHAR(100),
    transaction_id VARCHAR(100),
    upi_id VARCHAR(100),
    card_number VARCHAR(30),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Query 12: INVOICES Table
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    payment_id INT NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_date DATE DEFAULT CURRENT_DATE,
    total_amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);

-- Query 13: SERVICES Table
CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,
    hotel_id INT NOT NULL,
    service_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- Query 14: COUPONS Table
CREATE TABLE coupons (
    coupon_id SERIAL PRIMARY KEY,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    discount_type VARCHAR(30),
    status VARCHAR(30),
    valid_to DATE
);

-- Query 15: FAVORITES Table
CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id)
);

-- Query 16: NOTIFICATIONS Table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Query 17: REVIEWS Table
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    hotel_id INT NOT NULL,
    room_id INT NOT NULL,
    rating DECIMAL(2,1),
    review_text TEXT,
    review_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (hotel_id) REFERENCES hotels(hotel_id),
    FOREIGN KEY (room_id) REFERENCES rooms(room_id)
);

-- Insert rows into USERS
INSERT INTO users (name, email, password, phone, role)
VALUES
('Murugan', 'murugan@gmail.com', 'murugan123', '9876543210', 'USER'),
('Mohan', 'mohan@gmail.com', 'mohan123', '9876543211', 'USER'),
('Naveen', 'naveen@gmail.com', 'naveen123', '9876543212', 'USER'),
('Vadivel', 'vadivel@gmail.com', 'vadivel123', '9876543213', 'OWNER'),
('Palaniyammal', 'palaniyammal@gmail.com', 'palani123', '9876543214', 'USER');

-- Insert rows into PROPERTIES
INSERT INTO properties (owner_id, property_name, property_type, description, address, city)
VALUES
(1, 'Murugan Residency', 'Hotel', 'Comfortable hotel property', 'Main Road', 'Trichy'),
(2, 'Mohan Grand Stay', 'Resort', 'Luxury resort property', 'Airport Road', 'Chennai'),
(3, 'Naveen Lodge', 'Lodge', 'Affordable accommodation', 'Bus Stand Road', 'Madurai'),
(4, 'Vadivel Palace', 'Hotel', 'Premium hotel property', 'Anna Nagar', 'Coimbatore'),
(5, 'Palaniyammal Stay', 'Homestay', 'Comfortable family stay', 'Temple Road', 'Palani');

-- Insert rows into HOTELS
INSERT INTO hotels (property_id, hotel_name, location, description, rating, price, category, image_url)
VALUES
(1, 'Murugan Residency Hotel', 'Trichy', 'Comfortable stay with modern facilities', 4.2, 2500.00, 'Luxury', 'hotel1.jpg'),
(2, 'Mohan Grand Hotel', 'Chennai', 'Premium hotel near the city center', 4.5, 4000.00, 'Premium', 'hotel2.jpg'),
(3, 'Naveen Lodge Hotel', 'Madurai', 'Affordable and comfortable accommodation', 3.8, 1500.00, 'Budget', 'hotel3.jpg'),
(4, 'Vadivel Palace Hotel', 'Coimbatore', 'Elegant rooms with quality service', 4.3, 3500.00, 'Luxury', 'hotel4.jpg'),
(5, 'Palaniyammal Stay Hotel', 'Palani', 'Peaceful stay near the temple', 4.0, 2000.00, 'Standard', 'hotel5.jpg');

-- Insert rows into HOTEL_STAFF
INSERT INTO hotel_staff (hotel_id, name, phone, position)
VALUES
(1, 'Ramesh', '9876500001', 'Manager'),
(2, 'Suresh', '9876500002', 'Receptionist'),
(3, 'Kumar', '9876500003', 'Housekeeper'),
(4, 'Raj', '9876500004', 'Chef'),
(5, 'Mani', '9876500005', 'Security');

-- Insert rows into ROOMS
INSERT INTO rooms (room_number, room_type, status, price, capacity, hotel_id, image_url)
VALUES
('101', 'Single', 'Available', 1500.00, 1, 1, 'room1.jpg'),
('102', 'Double', 'Available', 2500.00, 2, 2, 'room2.jpg'),
('103', 'Deluxe', 'Booked', 3500.00, 3, 3, 'room3.jpg'),
('104', 'Suite', 'Available', 5000.00, 4, 4, 'room4.jpg'),
('105', 'Standard', 'Maintenance', 2000.00, 2, 5, 'room5.jpg');

-- Insert rows into HOTEL_IMAGES
INSERT INTO hotel_images (hotel_id, image_url)
VALUES
(1, 'hotel1.jpg'),
(2, 'hotel2.jpg'),
(3, 'hotel3.jpg'),
(4, 'hotel4.jpg'),
(5, 'hotel5.jpg');

-- Insert rows into ROOM_TYPES
INSERT INTO room_types (type_name, description, max_capacity)
VALUES
('Single', 'Room for one person', 1),
('Double', 'Room for two people', 2),
('Deluxe', 'Luxury room with extra facilities', 3),
('Suite', 'Premium spacious room', 4),
('Standard', 'Basic comfortable room', 2);

-- Insert rows into HOTEL_DETAILS
INSERT INTO hotel_details (hotel_id, check_in_time, check_out_time, contact)
VALUES
(1, '12:00:00', '11:00:00', '9876543201'),
(2, '12:00:00', '11:00:00', '9876543202'),
(3, '01:00:00', '12:00:00', '9876543203'),
(4, '12:00:00', '10:00:00', '9876543204'),
(5, '11:00:00', '10:00:00', '9876543205');

-- Insert rows into SKILLS
INSERT INTO skills (skill_name, description)
VALUES
('Hotel Management', 'Managing hotel operations'),
('Customer Service', 'Providing quality service to customers'),
('Communication', 'Effective communication skills'),
('Housekeeping', 'Maintaining cleanliness and rooms'),
('Food Service', 'Managing food and restaurant services');

-- Insert rows into BOOKINGS
INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, guests, status, total_amount)
VALUES
(1, 1, '2026-09-10', '2026-09-12', 1, 'Confirmed', 3000.00),
(2, 2, '2026-09-15', '2026-09-17', 2, 'Confirmed', 5000.00),
(3, 3, '2026-09-20', '2026-09-23', 3, 'Pending', 10500.00),
(4, 4, '2026-10-01', '2026-10-03', 2, 'Confirmed', 10000.00),
(5, 5, '2026-10-05', '2026-10-07', 2, 'Pending', 4000.00);

-- Insert rows into PAYMENTS
INSERT INTO payments (booking_id, amount, method, payment_status, bank_name, transaction_id, upi_id, card_number)
VALUES
(1, 3000.00, 'UPI', 'Completed', 'State Bank of India', 'TXN10001', 'murugan@upi', NULL),
(2, 5000.00, 'Card', 'Completed', 'HDFC Bank', 'TXN10002', NULL, 'XXXX-XXXX-XXXX-1234'),
(3, 10500.00, 'UPI', 'Pending', 'ICICI Bank', 'TXN10003', 'naveen@upi', NULL),
(4, 10000.00, 'Card', 'Completed', 'Axis Bank', 'TXN10004', NULL, 'XXXX-XXXX-XXXX-5678'),
(5, 4000.00, 'UPI', 'Pending', 'Indian Bank', 'TXN10005', 'palani@upi', NULL);

-- Insert rows into INVOICES
INSERT INTO invoices (payment_id, invoice_number, total_amount)
VALUES
(1, 'INV001', 3000.00),
(2, 'INV002', 5000.00),
(3, 'INV003', 10500.00),
(4, 'INV004', 10000.00),
(5, 'INV005', 4000.00);

-- Insert rows into SERVICES
INSERT INTO services (hotel_id, service_name, description, price)
VALUES
(1, 'Room Service', 'Food and beverages delivered to the room', 500.00),
(2, 'Swimming Pool', 'Access to the swimming pool', 300.00),
(3, 'Laundry Service', 'Washing and ironing clothes', 200.00),
(4, 'Airport Pickup', 'Transportation from airport to hotel', 1000.00),
(5, 'Spa Service', 'Relaxing spa and wellness service', 1500.00);

-- Insert rows into COUPONS
INSERT INTO coupons (coupon_code, discount_value, discount_type, status, valid_to)
VALUES
('WELCOME10', 10.00, 'Percentage', 'Active', '2026-12-31'),
('SAVE500', 500.00, 'Fixed', 'Active', '2026-11-30'),
('HOTEL20', 20.00, 'Percentage', 'Active', '2026-10-31'),
('FESTIVE15', 15.00, 'Percentage', 'Active', '2026-12-25'),
('SUMMER300', 300.00, 'Fixed', 'Inactive', '2026-09-30');

-- Insert rows into FAVORITES
INSERT INTO favorites (user_id, hotel_id)
VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Insert rows into NOTIFICATIONS
INSERT INTO notifications (user_id, message, type, is_read)
VALUES
(1, 'Your booking has been confirmed.', 'Booking', FALSE),
(2, 'Your payment was successful.', 'Payment', TRUE),
(3, 'Your booking is pending.', 'Booking', FALSE),
(4, 'Your payment has been confirmed.', 'Payment', TRUE),
(5, 'New offers are available for you.', 'Offer', FALSE);

-- Insert rows into REVIEWS
INSERT INTO reviews (user_id, hotel_id, room_id, rating, review_text)
VALUES
(1, 1, 1, 4.5, 'Excellent stay and good service'),
(2, 2, 2, 4.0, 'Comfortable room and friendly staff'),
(3, 3, 3, 3.5, 'Good stay at an affordable price'),
(4, 4, 4, 4.8, 'Luxury hotel with excellent facilities'),
(5, 5, 5, 4.2, 'Peaceful stay and good experience');

-- INNER JOIN
SELECT users.name, bookings.booking_id, bookings.status
FROM users
INNER JOIN bookings
ON users.user_id = bookings.user_id;

-- LEFT JOIN
SELECT users.name, bookings.booking_id, bookings.status
FROM users
LEFT JOIN bookings
ON users.user_id = bookings.user_id;

-- RIGHT JOIN
SELECT users.name, bookings.booking_id, bookings.status
FROM users
RIGHT JOIN bookings
ON users.user_id = bookings.user_id;

-- FULL JOIN
SELECT users.name, bookings.booking_id, bookings.status
FROM users
FULL JOIN bookings
ON users.user_id = bookings.user_id;

-- NATURAL JOIN
SELECT name, booking_id, status
FROM users
NATURAL JOIN bookings;

SELECT * FROM users;

SELECT * FROM properties;

SELECT * FROM hotels;

SELECT * FROM hotel_staff;

SELECT * FROM rooms;

SELECT * FROM hotel_images;

SELECT * FROM room_types;

SELECT * FROM hotel_details;

SELECT * FROM skills;

SELECT * FROM bookings;

SELECT * FROM payments;

SELECT * FROM invoices;

SELECT * FROM services;

SELECT * FROM coupons;

SELECT * FROM favorites;

SELECT * FROM notifications;

SELECT * FROM reviews;

-- ============================================
-- BUSINESS QUERIES
-- ============================================

-- Query 1: Find all available rooms
SELECT *
FROM rooms
WHERE status = 'AVAILABLE';


-- Query 2: Find hotels by city
SELECT *
FROM hotels
WHERE location = 'Coimbatore';


-- Query 3: Find rooms within a price range
SELECT *
FROM rooms
WHERE price BETWEEN 1000 AND 5000;


-- Query 4: Display booking details with customer name
SELECT 
    b.booking_id,
    u.name AS customer_name,
    b.check_in_date,
    b.check_out_date,
    b.guests,
    b.status,
    b.total_amount
FROM bookings b
JOIN users u ON b.user_id = u.user_id;


-- Query 5: Display booking details with room information
SELECT
    b.booking_id,
    r.room_number,
    r.room_type,
    r.price,
    b.check_in_date,
    b.check_out_date,
    b.status
FROM bookings b
JOIN rooms r ON b.room_id = r.room_id;


-- Query 6: Display payment and invoice details
SELECT
    p.payment_id,
    p.booking_id,
    p.amount,
    p.method,
    p.payment_status,
    i.invoice_number,
    i.invoice_date
FROM payments p
JOIN invoices i ON p.payment_id = i.payment_id;


-- Query 7: Display hotels with their average rating
SELECT
    h.hotel_id,
    h.hotel_name,
    AVG(r.rating) AS average_rating
FROM hotels h
JOIN reviews r ON h.hotel_id = r.hotel_id
GROUP BY h.hotel_id, h.hotel_name;


-- Query 8: Count total bookings for each hotel
SELECT
    h.hotel_id,
    h.hotel_name,
    COUNT(b.booking_id) AS total_bookings
FROM hotels h
JOIN rooms r ON h.hotel_id = r.hotel_id
JOIN bookings b ON r.room_id = b.room_id
GROUP BY h.hotel_id, h.hotel_name;


-- Query 9: Display hotels and their available services
SELECT
    h.hotel_name,
    s.service_name,
    s.description,
    s.price
FROM hotels h
JOIN services s ON h.hotel_id = s.hotel_id;


-- Query 10: Display user's favorite hotels
SELECT
    u.name AS customer_name,
    h.hotel_name,
    f.created_at
FROM favorites f
JOIN users u ON f.user_id = u.user_id
JOIN hotels h ON f.hotel_id = h.hotel_id;