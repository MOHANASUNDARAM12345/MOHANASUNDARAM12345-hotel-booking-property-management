# StayRest Database

The system uses **PostgreSQL 14+**. Local database name: `hotel_booking_db`.

## Connecting

Credentials are read from environment variables:

```env
DB_URL=jdbc:postgresql://localhost:5432/hotel_booking_db
DB_USERNAME=postgres
DB_PASSWORD=<from backend/backend/.env>
```

During automated tests the backend switches to an in-memory **H2** database
(`src/test/resources/application.properties`), so `mvnw test` runs hermetically
without requiring PostgreSQL.

From psql (Windows):

```powershell
$env:PGPASSWORD = "<password>"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -d hotel_booking_db
```

## Schema

Core tables (see `database/database.sql` for the full DDL):

- `users` — guests and owners (role: `USER` / `OWNER`)
- `properties` — a physical location owned by an `OWNER`
- `hotels` — listings that belong to a `property_id`
- `rooms` — inventory under a `hotel_id`; `(hotel_id, room_number)` is unique
- `bookings` — reservations referencing `user_id` and `room_id`
- `payments` — simulated payments; success flips a booking to `CONFIRMED`
- `invoices` — generated per successful payment
- `hotel_staff`, `hotel_details`, `hotel_images`, `room_types` — owner-supplied
  hotel extras
- `services`, `coupons`, `favorites`, `notifications`, `reviews` — supporting
  owner and guest features

## Booking statuses

Stored in lowercase-insensitive strings (canonical values in
`BookingStatus.java`):

`PENDING` → `CONFIRMED` → `CHECKED_IN` / `CHECKED_OUT` → `COMPLETED`.

`CANCELLED` frees a room for the same dates. Availability only considers
non-cancelled, non-checked-out, non-completed bookings.

## Migrations

SQL lives under `database/migrations/` and is designed to be idempotent
(re-runnable):

| File                          | Purpose                                            |
| ----------------------------- | -------------------------------------------------- |
| `V1__schema_and_seed.sql`     | Baseline schema + seed hotels/rooms/services       |
| `V2__room_and_booking_integrity.sql` | Unique room numbers per hotel, booking/date indexes, check constraints |

## Seeding behavior (`RoomSeeder`)

On startup the backend tops up any hotel that has fewer rooms than the standard
set, so every hotel is guaranteed a consistent, bookable inventory. It never
duplicates existing room numbers within a hotel and is safe to re-run.

## Integrity guarantees

- `uq_rooms_hotel_room_number` — no two rooms share a number in the same hotel
- `idx_bookings_room_dates` — fast overlap/availability lookups
- `idx_bookings_user` — fast "my bookings" queries
- `chk_bookings_checkout_after_checkin` — checkout must follow check-in
- `chk_rooms_price_non_negative` — room fees cannot be negative