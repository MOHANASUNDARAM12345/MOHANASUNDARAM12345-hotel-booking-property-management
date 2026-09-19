# Problem Statement

## 1. Project Title

Hotel Booking and Property Management System

## 2. Project Nickname

StayRest

## 3. Domain

Hospitality and Hotel Management

## 4. Who is the User?

The system is designed for the following user types:

### 4.1 Customer

Customers can:
- Search and view available hotels.
- View hotel details and available rooms.
- Check room availability.
- Make hotel room bookings.
- View booking details and booking status.
- Make and view payment details.
- View available hotel services.
- Add hotels to favorites.
- Submit ratings and reviews.

### 4.2 Property Owner

Property owners can:
- Manage their properties.
- Manage hotel information.
- Manage rooms and room availability.
- Manage room types and pricing.
- Manage hotel services.
- View customer bookings.
- View property-related information.

### 4.3 Admin

Administrators can:
- Manage users.
- Manage properties and hotels.
- Manage rooms and hotel-related information.
- Monitor bookings and payments.
- Manage reviews and system-related information.
- Maintain overall system operations.

## 5. What Problem Are We Solving?

Traditional hotel booking and property management processes can involve separate methods for maintaining hotel information, room availability, customer bookings, payments, services, reviews, and property details.

Customers may find it difficult to identify suitable hotels and available rooms while also managing their booking and payment information.

Property owners need an organized way to manage hotel properties, rooms, services, bookings, and related information.

Therefore, there is a need for a centralized web-based system that connects customers, property owners, and administrators and provides structured management of hotel booking and property-related operations.

## 6. Real-Life Problem Example

A customer wants to book a hotel room for a specific date. The customer needs to know which hotels are available, which rooms are available, the room price, hotel details, and booking status.

At the same time, the property owner needs to maintain room availability and manage incoming bookings.

If these activities are handled separately, maintaining accurate information can become difficult.

The proposed system provides a centralized platform where customers can search and book rooms while property owners can manage their hotel and property information.

## 7. Proposed Solution

The proposed solution is a web-based Hotel Booking and Property Management System.

The system will provide the following major features:

### 7.1 Hotel Management
- Add and manage hotel information.
- Display hotel details.
- Manage hotel images and additional details.
- Manage hotel staff information.

### 7.2 Property Management
- Manage property information.
- Associate properties with hotels.
- Allow property owners to manage their property-related information.

### 7.3 Room Management
- Add and manage rooms.
- Maintain room numbers.
- Maintain room types.
- Maintain room prices.
- Maintain room capacity.
- Maintain room availability status.

### 7.4 Booking Management
- Allow customers to make room bookings.
- Store check-in and check-out dates.
- Store number of guests.
- Maintain booking status.
- Maintain booking amount.

### 7.5 Payment Management
- Store payment information.
- Maintain payment amount.
- Maintain payment method.
- Maintain payment status.
- Associate payments with bookings.

### 7.6 Service Management
- Manage hotel services.
- Store service names and prices.
- Display services associated with hotels.

### 7.7 Review Management
- Allow customers to provide ratings and reviews.
- Store hotel review information.
- Display reviews associated with hotels.

### 7.8 Favorites
- Allow customers to mark hotels as favorites.
- Maintain customer favorite hotel information.

### 7.9 Notification Management
- Maintain notifications for users.
- Provide system-related notification information.

### 7.10 Invoice Management
- Maintain invoice information associated with payments.

## 8. Core Entities / Database Tables

The system will use a relational database with the following core entities/tables:

1. Users
2. Properties
3. Hotels
4. Hotel Staff
5. Rooms
6. Hotel Images
7. Room Types
8. Hotel Details
9. Skills
10. Bookings
11. Payments
12. Invoices
13. Services
14. Coupons
15. Favorites
16. Notifications
17. Reviews

These entities support the major business operations of the Hotel Booking and Property Management System.

## 9. User Roles and Permissions

| User Role | Permissions |
|-----------|-------------|
| Customer | Search hotels, view hotel details, view available rooms, make bookings, view booking details, make/view payments, view services, add favorites, submit reviews and ratings |
| Property Owner | Manage properties, manage hotel information, manage rooms, manage room availability, manage services, and view bookings |
| Admin | Manage users, properties, hotels, rooms, bookings, payments, reviews, and overall system information |

## 10. Business Logic

The system will implement the following important business logic:

- Customers can view hotels and rooms.
- Only available rooms should be available for booking.
- A booking should be associated with a customer and a room.
- A booking should contain check-in and check-out dates.
- Booking status should be maintained.
- Payment information should be associated with bookings.
- Hotels can have multiple rooms and services.
- Users can maintain favorite hotels.
- Customers can provide ratings and reviews for hotels.
- Property owners can manage their hotel and property information.
- Administrators can manage system-level information.

## 11. Success Criteria

The project will be considered successful when:

1. Customers can view available hotels and rooms.
2. Customers can successfully create hotel room bookings.
3. Booking details and booking status are stored correctly.
4. Payment information can be recorded and managed.
5. Property owners can manage their hotel, rooms, and services.
6. Administrators can manage users and system information.
7. Hotel reviews and ratings can be stored and displayed.
8. The system maintains structured and related relational database information.
9. The major features can be accessed through a web-based application.
10. The application follows a clear full-stack development structure.

## 12. Out of Scope

The following features are outside the initial scope of this project:

- Native Android or iOS mobile application.
- Advanced AI-based hotel recommendation system.
- IoT-based smart hotel management.
- Advanced business intelligence and analytics.
- Voice-based booking.
- Fully automated chatbot-based customer support.
- International multi-currency payment processing.
- Advanced third-party travel platform integration.

These features may be considered as future enhancements.

## 13. Future Enhancement Scope

The system can be extended in the future with:

- AI-based hotel and room recommendations.
- Personalized recommendations based on customer preferences.
- Advanced analytics and reporting.
- Third-party payment gateway integration.
- Email and SMS notifications.
- Map and location-based hotel search.
- Mobile application.
- AI-powered customer support chatbot.

## 14. Third-Party Integration Scope

The system can be extended to integrate with third-party services such as:

- Payment gateway services.
- Email notification services.
- SMS notification services.
- Map and location services.

Third-party integrations are considered as an extension of the system and are not required for the initial problem statement implementation.

## 15. AI Integration Scope

AI functionality is not part of the initial core implementation.

However, the system provides scope for future AI integration such as:

- Personalized hotel recommendations.
- Room recommendations based on customer requirements.
- Customer preference analysis.
- Review sentiment analysis.
- Intelligent booking assistance.

## 16. Chosen Development Track

**Java — Spring Boot**

### Planned Technology Stack

- Frontend: React.js
- Backend: Spring Boot
- Programming Language: Java
- Database: PostgreSQL
- API Communication: REST API
- ORM: Spring Data JPA / Hibernate
- Build Tool: Maven
- Testing: JUnit 5
- API Documentation: Swagger / OpenAPI
- Version Control: Git and GitHub
- CI/CD: GitHub Actions
- Frontend Deployment: Vercel / Netlify
- Backend Deployment: Render / Railway
- Cloud Database: PostgreSQL-compatible cloud database

## 17. Project Scope

The project focuses on developing a full-stack web application that combines hotel booking functionality with property management.

The system will connect customers, property owners, and administrators through role-based access and centralized data management.

The application will manage hotels, properties, rooms, bookings, payments, services, reviews, and related information using a relational database.

## 18. Expected Outcome

The expected outcome is a functional full-stack Hotel Booking and Property Management System that provides:

- A structured hotel and property management platform.
- Room availability and booking management.
- Customer booking and payment management.
- Hotel service management.
- Review and rating management.
- Role-based access for customers, property owners, and administrators.
- A relational database supporting the major business operations.

## 19. Originality

The project combines hotel booking and property management functionalities into a single centralized system.

The system is designed as an academic full-stack development project with its own database structure, business logic, user roles, and future extension possibilities.

## 20. Problem Statement Summary

The Hotel Booking and Property Management System aims to provide a centralized web-based solution for managing hotel properties, rooms, availability, customer bookings, payments, services, reviews, and related operations.

The system will improve the organization of hotel and booking information by connecting customers, property owners, and administrators through a structured full-stack application.

The project will be developed using the Java Spring Boot development track with React.js and PostgreSQL.