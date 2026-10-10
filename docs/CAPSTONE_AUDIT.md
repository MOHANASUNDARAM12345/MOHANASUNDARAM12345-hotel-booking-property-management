# Capstone Audit Report — Hotel Booking and Property Management System (StayRest)

**Date**: October 9, 2026  
**Auditor**: Senior Full-Stack Software Architect & Reviewer  
**Project**: Hotel Booking and Property Management System (StayRest)

---

## Executive Summary

An in-depth architectural and code audit of the **StayRest** application was performed across frontend components, Spring Boot backend services, JPA entities, database schema scripts, automated test suites, Git history, and CI/CD pipelines.

The codebase boasts a solid full-stack foundation with 17 relational database tables, 16 JPA entities, Spring Security JWT authentication, and a modern React.js frontend built with Vite 8. All existing JUnit 5 unit tests pass cleanly (9/9 passing) and the Vite frontend compiles without errors.

---

## Module & CRUD Audit Status Table

| Module / Entity | Backend Entity & Repo | Controller & API Endpoints | Security & Auth | Status | Deficiencies / Needed Fixes |
|---|---|---|---|---|---|
| **Users & Auth** | `User.java`, `UserRepository` | `AuthController`, `LoginController`, `UserController` | BCrypt, JWT Bearer Token | **PARTIAL** | Password check allows plain text fallback for legacy seeded users; email uniqueness error handling returns 400 instead of strict validation messages. |
| **Properties** | `Property.java`, `PropertyRepository` | `PropertyController` (`/api/owner/properties`) | `@hasRole('OWNER')` | **COMPLETE** | CRUD operational. Needs ownership check to prevent owners modifying other owners' properties. |
| **Hotels** | `Hotel.java`, `HotelRepository` | `HotelController`, `PublicHotelController` | Public read, Owner edit | **COMPLETE** | Filtering by rating, price, category supported in JS; backend query filters can be enhanced. |
| **Hotel Details** | `HotelDetail.java` | `HotelDetailController` | Authenticated | **PARTIAL** | Basic CRUD present; needs check-in/out policy display integration in frontend details page. |
| **Hotel Images** | `HotelImage.java` | `HotelImageController` | Public / Owner | **PARTIAL** | Image upload handling relies on URL strings; missing primary image flag toggle. |
| **Rooms** | `Room.java`, `RoomRepository` | `RoomController`, `PublicHotelController` | Public read, Owner edit | **COMPLETE** | Room creation, update, delete working. Needs status check (MAINTENANCE/BOOKED) block during booking. |
| **Room Types** | `RoomType.java` | `RoomTypeController` | Authenticated | **COMPLETE** | Managed via REST APIs. |
| **Bookings** | `Booking.java`, `BookingRepository` | `BookingController` (`/api/bookings`) | Authenticated | **COMPLETE** | Overlap check active (`findOverlappingBookings`). Needs total price auto-calculation with room rate & days. |
| **Payments** | `Payment.java`, `PaymentRepository` | `PaymentController` (`/api/payments`) | Authenticated | **COMPLETE** | PCI-compliant card masking (`****-****-****-1234`), auto invoice generation triggers on payment. |
| **Invoices** | `Invoice.java`, `InvoiceRepository` | `InvoiceController` (`/api/invoices`) | Authenticated | **COMPLETE** | Auto-generates unique `INV-XXXXX` codes upon payment. |
| **Favorites** | `Favorite.java`, `FavoriteRepository` | `FavoriteController` (`/api/favorites`) | Authenticated | **COMPLETE** | User can add/remove favorite hotels and view listing on Favorites page. |
| **Hotel Staff** | `HotelStaff.java` | `HotelStaffController` (`/api/owner/staff`) | Owner only | **COMPLETE** | Manage hotel staff (reception, manager, housekeeping). |
| **Services** | `HotelServiceItem.java` | `ServiceController` (`/api/services`) | Public GET, Owner POST/DELETE | **COMPLETE** | Hotel add-on services managed. |
| **Coupons** | `Coupon.java`, `CouponRepository` | `CouponController` (`/api/coupons`) | Public GET, Owner POST/DELETE | **COMPLETE** | Code validation and discount application logic operational. |
| **Reviews** | `Review.java`, `ReviewRepository` | `ReviewController` (`/api/reviews`) | Public GET, User POST | **PARTIAL** | Needs rating recalculation on hotel table when review posted. |
| **Notifications**| `Notification.java` | `NotificationController` | Authenticated | **COMPLETE** | Displays booking and payment alert messages. |

---

## Critical Business Logic Audit

1. **Double Booking Prevention**: Enforced in `BookingService.java` using JPQL `@Query` (`findOverlappingBookings`). Prevents overlapping date reservations for the same room.
2. **Payment Card Masking**: Enforced in `PaymentService.java` (`****-****-****-1234`).
3. **Automated Invoicing**: `PaymentService` automatically calls `InvoiceService` to create a tied invoice record upon payment completion.
4. **Role Enforcement**: `/api/owner/**` routes are locked down via `SecurityConfig.java` to `hasRole('OWNER')`.

---

## Technical Verification Summary

- **Maven Test Build**: `9/9` JUnit 5 tests passed with zero failures.
- **Frontend Vite Build**: Production build bundled successfully (`dist/assets/index-DMC9jtpM.js`).
- **Database Engine**: PostgreSQL `hotel_booking` running with 17 normalized tables.
- **CI/CD**: `.github/workflows/ci.yml` properly configured for automated build and test on pushes to `main`.
