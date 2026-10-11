# StayRest API Reference

Base URL for local development: `http://localhost:8080/api`

Unless marked **Public**, endpoints return `401 Unauthorized` without a valid
`Authorization: Bearer <jwt>` header. Owner endpoints require the `OWNER` role.

Interactive documentation (Springdoc OpenAPI / Swagger UI) is available while
the backend runs at `http://localhost:8080/swagger-ui/index.html`.

---

## Auth

| Method | Endpoint              | Auth   | Description                        |
| ------ | --------------------- | ------ | ---------------------------------- |
| POST   | `/auth/register`      | Public | Create a user account              |
| POST   | `/auth/login`         | Public | Authenticate and receive a JWT     |

## Health

| Method | Endpoint  | Auth   | Description                 |
| ------ | --------- | ------ | --------------------------- |
| GET    | `/health` | Public | Liveness check              |

## Public Catalog

| Method | Endpoint                          | Auth   | Description                                  |
| ------ | --------------------------------- | ------ | -------------------------------------------- |
| GET    | `/hotels`                         | Public | List all hotels                              |
| GET    | `/hotels/{id}`                    | Public | Fetch a single hotel                         |
| GET    | `/hotels/{hotelId}/rooms`         | Public | List all rooms of a hotel                    |
| GET    | `/hotels/{hotelId}/available-rooms` | Public | Available rooms for `checkIn`, `checkOut`, `guests` *(all optional)* |
| GET    | `/rooms`                          | Public | List all rooms                               |
| GET    | `/rooms/{id}`                     | Public | Fetch a single room                          |
| GET    | `/coupons`                        | Public | List coupons                                 |
| GET    | `/coupons/{id}`                   | Public | Fetch a coupon                               |
| GET    | `/coupons/code/{code}`            | Public | Look up a coupon by its code                 |
| GET    | `/services`                       | Public | List add-on services                         |
| GET    | `/services/{id}`                  | Public | Fetch a service                              |
| GET    | `/services/hotel/{hotelId}`       | Public | List services of a hotel                     |

## Bookings

| Method | Endpoint                              | Description                                      |
| ------ | ------------------------------------- | ------------------------------------------------ |
| POST   | `/bookings`                           | Create a booking (validates overlap, capacity, dates) |
| GET    | `/bookings`                           | List all bookings                                |
| GET    | `/bookings/{id}`                      | Fetch a booking                                  |
| GET    | `/bookings/user/{userId}`             | Bookings of a user (My Reservations)             |
| GET    | `/bookings/room/{roomId}`             | Bookings of a room                               |
| GET    | `/bookings/{id}/cancellation-refund-estimate` | Quote a refund before cancelling        |
| PUT    | `/bookings/{id}/cancel`               | Cancel a booking (idempotent)                    |
| PUT    | `/bookings/{id}/checkout`             | Check out / complete a booking                   |
| PUT    | `/bookings/{id}`                      | Update booking fields                            |
| DELETE | `/bookings/{id}`                      | Delete a booking                                 |

## Payments & Invoices

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| POST   | `/payments`                 | Process a payment; confirms the booking and generates an invoice |
| GET    | `/payments`                 | List payments                        |
| GET    | `/payments/{id}`            | Fetch a payment                      |
| GET    | `/payments/booking/{bookingId}` | Payments for a booking            |
| PUT    | `/payments/{id}`            | Update a payment                     |
| DELETE | `/payments/{id}`            | Delete a payment                     |
| POST   | `/invoices`                 | Create an invoice                    |
| GET    | `/invoices`                 | List invoices                        |
| GET    | `/invoices/{id}`            | Fetch an invoice                     |
| GET    | `/invoices/payment/{paymentId}` | Fetch invoice for a payment      |
| PUT    | `/invoices/{id}`            | Update an invoice                    |
| DELETE | `/invoices/{id}`            | Delete an invoice                    |

## Reviews & Favorites

| Method | Endpoint                          | Description                        |
| ------ | --------------------------------- | ---------------------------------- |
| POST   | `/reviews`                        | Post a review (recalculates hotel rating) |
| GET    | `/reviews/hotel/{hotelId}`        | Reviews for a hotel                |
| GET    | `/reviews/user/{userId}`          | Reviews written by a user          |
| DELETE | `/reviews/{id}`                   | Delete a review                    |
| POST   | `/favorites`                      | Save a favorite hotel              |
| GET    | `/favorites/user/{userId}`        | List a user's favorites            |
| DELETE | `/favorites/user/{userId}/hotel/{hotelId}` | Remove a favorite           |
| DELETE | `/favorites/{id}`                 | Delete a favorite by id            |

## Notifications

| Method | Endpoint             | Description                     |
| ------ | -------------------- | ------------------------------- |
| POST   | `/notifications`     | Create a notification           |
| GET    | `/notifications/user/{userId}` | List a user's notifications |
| PUT    | `/notifications/{id}/read` | Mark a notification as read |
| DELETE | `/notifications/{id}` | Delete a notification           |

## Owner — Properties, Hotels, Rooms

| Method | Endpoint                          | Description                              |
| ------ | --------------------------------- | ---------------------------------------- |
| POST   | `/owner/properties`               | Create a property                        |
| GET    | `/owner/properties`               | List properties                          |
| GET    | `/owner/properties/{id}`          | Fetch a property                         |
| GET    | `/owner/properties/owner/{ownerId}` | Properties of an owner                 |
| PUT    | `/owner/properties/{id}`          | Update a property                        |
| DELETE | `/owner/properties/{id}`          | Delete a property                        |
| POST   | `/owner/hotels`                   | Create a hotel (validated)               |
| GET    | `/owner/hotels`                   | List hotels                              |
| GET    | `/owner/hotels/{id}`              | Fetch a hotel                            |
| GET    | `/owner/hotels/property/{propertyId}` | Hotels of a property                  |
| PUT    | `/owner/hotels/{id}`              | Update a hotel                           |
| DELETE | `/owner/hotels/{id}`              | Delete a hotel                           |
| POST   | `/owner/rooms`                    | Create a room (validated)                |
| GET    | `/owner/rooms`                    | List rooms                               |
| GET    | `/owner/rooms/{id}`               | Fetch a room                             |
| GET    | `/owner/rooms/hotel/{hotelId}`    | Rooms of a hotel                         |
| PUT    | `/owner/rooms/{id}`               | Update a room                            |
| DELETE | `/owner/rooms/{id}`               | Delete a room                            |

## Owner — Staff, Services, Coupons

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/owner/staff`            | Add staff member                |
| GET    | `/owner/staff`            | List staff                      |
| GET    | `/owner/staff/{id}`       | Fetch a staff member            |
| GET    | `/owner/staff/hotel/{hotelId}` | Staff of a hotel            |
| PUT    | `/owner/staff/{id}`       | Update staff member             |
| DELETE | `/owner/staff/{id}`       | Remove staff member             |
| POST   | `/owner/services`         | Create a service                |
| PUT    | `/owner/services/{id}`    | Update a service                |
| DELETE | `/owner/services/{id}`    | Delete a service                |
| POST   | `/owner/coupons`          | Create a coupon                 |
| PUT    | `/owner/coupons/{id}`     | Update a coupon                 |
| DELETE | `/owner/coupons/{id}`     | Delete a coupon                 |
| POST   | `/owner/hotel-details`    | Create hotel detail record      |
| GET    | `/owner/hotel-details`    | List hotel details              |
| GET    | `/owner/hotel-details/{id}` | Fetch a hotel detail          |
| GET    | `/owner/hotel-details/hotel/{hotelId}` | Details of a hotel     |
| DELETE | `/owner/hotel-details/{id}` | Delete a hotel detail         |
| POST   | `/owner/hotel-images`     | Attach an image to a hotel      |
| GET    | `/owner/hotel-images/hotel/{hotelId}` | Images of a hotel      |
| DELETE | `/owner/hotel-images/{id}` | Remove a hotel image           |
| POST   | `/owner/room-types`       | Define a room type              |
| GET    | `/owner/room-types`       | List room types                 |
| GET    | `/owner/room-types/{id}`  | Fetch a room type               |
| GET    | `/owner/room-types/hotel/{hotelId}` | Room types of a hotel   |
| PUT    | `/owner/room-types/{id}`  | Update a room type              |
| DELETE | `/owner/room-types/{id}`  | Delete a room type              |
| GET    | `/owner/analytics`        | Occupancy / revenue dashboard   |
| GET    | `/owner/test`             | Owner role smoke test           |

## AI Assistants

| Method | Endpoint            | Description                                  |
| ------ | ------------------- | -------------------------------------------- |
| POST   | `/assistant/chat`   | Guest assistant chat                         |
| POST   | `/smart-stay/recommend` | Hotel recommendation                       |

## Common Booking Status Values

`PENDING` → `CONFIRMED` (on successful payment) → `CHECKED_IN` / `CHECKED_OUT`
→ `COMPLETED` (on checkout). `CANCELLED` frees the room for other dates.