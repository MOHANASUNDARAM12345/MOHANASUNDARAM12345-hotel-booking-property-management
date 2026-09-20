# HOTEL BOOKING AND PROPERTY MANAGEMENT SYSTEM

An end-to-end Full Stack Web Application designed for booking luxury hotel accommodations, managing hotel properties, handling guest reservations, processing secure payments, generating official invoices, and empowering property owners with complete administration tools.

---

## 1. Problem Statement

Traditional hotel booking and property administration systems often suffer from fragmented management tools, risk of double bookings, insecure payment processing, and poor accessibility for both hotel guests and property managers. The **StayRest Hotel Booking and Property Management System** provides a unified, secure, and modern web application that bridges the gap between property owners listing their properties/rooms and customers booking stays.

---

## 2. Objectives

- **Unified Hospitality Platform**: Seamlessly connect property owners and customers under a single full-stack web ecosystem.
- **Role-Based Access Control**: Strict segregation between `USER` (customer browsing, booking, payments, reviews) and `OWNER` (property listing, room inventory, staff management, coupon creation).
- **Overbooking Prevention**: Enforce business rules to validate check-in/check-out dates and eliminate double booking for overlapping dates.
- **PCI-Compliant Payment Security**: Mask credit card info (`****-****-****-1234`) and automate instant invoice generation upon payment completion.
- **RESTful Architecture**: Provide documented REST APIs via Swagger OpenAPI UI for seamless integration and deployment.

---

## 3. Technology Stack

### Frontend
- **Framework**: React.js (Vite 8)
- **Routing**: React Router 7
- **Styling**: Vanilla CSS (Design Tokens, Glassmorphism, Responsive Grid System)
- **Icons**: Lucide React Icons
- **Language**: JavaScript (ES6+)

### Backend
- **Framework**: Java 17, Spring Boot 4.0.8
- **ORM / Persistence**: Spring Data JPA, Hibernate
- **Security & Auth**: Spring Security, BCrypt Password Encoder, JSON Web Tokens (JWT)
- **Build Tool**: Apache Maven

### Database
- **Engine**: PostgreSQL 14+
- **Database Name**: `hotel_booking`

### Testing & Documentation
- **Testing**: JUnit 5, Mockito
- **API Documentation**: OpenAPI 3.0 / Swagger UI (`springdoc-openapi-starter-webmvc-ui`)

---

## 4. Key Features

### Customer Functionality (USER Role)
- **User Registration & JWT Login**: BCrypt password protection.
- **Browse & Search Hotels**: Filter hotels by location, rating, price, and category (Luxury, Resort, Budget, Boutique).
- **Hotel Details & Room Selection**: View room types, capacity, pricing, and complimentary hotel services.
- **Real-Time Booking**: Date validation (`check-in` < `check-out`) and guest count validation.
- **My Reservations Dashboard**: Track booking statuses (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).
- **Payment Gateway Simulation**: Pay via UPI, Credit/Debit Card, or NetBanking with automated card masking.
- **Instant Invoicing**: Downloadable and printable receipts with unique invoice numbers (`INV-XXXXX`).
- **Favorites & Notifications**: Save favorite properties and receive reservation alerts.
- **Reviews & Rating System**: Post reviews and automatically recalculate overall hotel ratings.

### Property Owner Functionality (OWNER Role)
- **Property Management**: Register properties with location, type, and description.
- **Hotel Management**: Create, update, and manage hotel listings associated with properties.
- **Room Management**: Define room numbers, room types, pricing, and availability statuses.
- **Staff Management**: Maintain staff records (receptionists, managers, housekeeping).
- **Discount Coupons**: Issue custom promo codes with max discount and minimum booking thresholds.
- **Service Management**: Offer add-on services (airport transfer, breakfast, spa).

---

## 5. System Requirements

- **Java JDK**: 17 or higher
- **Node.js**: 18.x or higher
- **PostgreSQL**: 14 or higher
- **Browser**: Modern web browser (Chrome, Edge, Firefox, Safari)

---

## 6. Project Structure

```
├── backend/
│   └── backend/                      # Spring Boot Maven Project
│       ├── src/main/java/com/stayrest/backend/
│       │   ├── config/               # SecurityConfig, JwtAuthenticationFilter
│       │   ├── controller/           # Health, Login, User, Owner, Property, Hotel, Room, Booking, Payment, Invoice, etc.
│       │   ├── entity/               # JPA Entities (User, Property, Hotel, Room, Booking, Payment, Invoice, etc.)
│       │   ├── exception/            # GlobalExceptionHandler
│       │   ├── repository/           # Spring Data Repositories
│       │   └── service/              # Core Business Logic Services
│       └── src/test/java/            # JUnit 5 Service Unit Tests
├── frontend/                         # React Vite Web Application
│   ├── src/
│   │   ├── components/               # Navbar, Footer
│   │   ├── context/                  # AuthContext
│   │   ├── pages/                    # Home, Login, Signup, Hotels, Details, MyBookings, Payment, Invoice, Favorites, Notifications, OwnerDashboard
│   │   └── services/                 # api.js REST API Client
│   └── index.css                     # Custom Design System
├── database/                         # SQL Schema & Seed scripts
├── .github/workflows/ci.yml          # GitHub Actions CI Workflow
├── .env.example                      # Sample Environment Variables
├── CHANGELOG.md                      # Milestone Version History
└── LICENSE                           # MIT License
```

---

## 7. Database Information

- **Database Name**: `hotel_booking`
- **Tables**:
  - `users` (user_id, name, email, password, phone, role, created_at)
  - `properties` (property_id, owner_id, property_name, property_type, description, address, city)
  - `hotels` (hotel_id, property_id, hotel_name, location, description, rating, price, category, image_url)
  - `rooms` (room_id, room_number, room_type, status, price, capacity, hotel_id, image_url)
  - `bookings` (booking_id, user_id, room_id, booking_date, check_in_date, check_out_date, guests, status, total_amount)
  - `payments` (payment_id, booking_id, amount, method, payment_date, payment_status, bank_name, transaction_id, upi_id, card_number)
  - `invoices` (invoice_id, payment_id, invoice_number, invoice_date, total_amount)
  - `hotel_staff` (staff_id, hotel_id, name, role, phone, email)
  - `hotel_details` (detail_id, hotel_id, check_in_time, check_out_time, policies, amenities, contact_email, contact_phone)
  - `hotel_images` (image_id, hotel_id, image_url, caption, is_primary)
  - `room_types` (room_type_id, hotel_id, type_name, description, base_price, capacity)
  - `services` (service_id, hotel_id, service_name, description, price, is_available)
  - `coupons` (coupon_id, code, discount_percentage, max_discount, min_booking_amount, expiry_date, is_active)
  - `favorites` (favorite_id, user_id, hotel_id, created_at)
  - `notifications` (notification_id, user_id, title, message, is_read, created_at)
  - `reviews` (review_id, user_id, hotel_id, rating, comment, created_at)

---

## 8. Backend Setup Instructions

1. **Configure PostgreSQL**:
   Ensure PostgreSQL is running locally and create the database:
   ```sql
   CREATE DATABASE hotel_booking;
   ```

2. **Navigate to Backend Directory**:
   ```bash
   cd backend/backend
   ```

3. **Build & Run Application**:
   ```bash
   # On Windows PowerShell / Command Prompt:
   .\mvnw.cmd spring-boot:run
   ```

4. **Verify Backend Health**:
   Open browser at `http://localhost:8080/api/health`

---

## 9. Frontend Setup Instructions

1. **Navigate to Frontend Directory**:
   ```bash
   cd frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Access Web App**:
   Open browser at `http://localhost:5173`

---

## 10. Environment Variables

Create `.env` file based on `.env.example`:

```env
# Database Credentials
DB_URL=jdbc:postgresql://localhost:5432/hotel_booking
DB_USERNAME=postgres
DB_PASSWORD=postgres

# JWT Secret
JWT_SECRET=stayrest-hotel-booking-secret-key-2026

# Frontend API Endpoint
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 11. Testing & Validation

### Automated Unit Tests (JUnit 5)
Run backend test suite:
```bash
cd backend/backend
.\mvnw.cmd test
```

### Swagger / OpenAPI Documentation
Once backend is running, access Swagger UI interactive API documentation at:
`http://localhost:8080/swagger-ui/index.html`

---

## 12. Deployment Instructions

### Frontend (Vite Static Build)
```bash
cd frontend
npm run build
```
Deploy the generated `dist/` directory to Vercel, Netlify, or AWS S3 + CloudFront.

### Backend (Executable JAR)
```bash
cd backend/backend
.\mvnw.cmd package -DskipTests
```
Run executable JAR on server (AWS EC2, Render, Heroku):
```bash
java -jar target/backend-0.0.1-SNAPSHOT.jar
```
