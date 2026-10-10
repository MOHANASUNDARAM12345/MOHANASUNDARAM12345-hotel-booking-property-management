# Master Implementation Plan — Hotel Booking and Property Management System

**Project**: StayRest  
**Date**: October 9, 2026  
**Approach**: Incremental, zero-breakage development with automated verification after each phase.

---

## Roadmap & Milestones

### Phase 1: Audit & Documentation (COMPLETED)
- [x] Full codebase inspection across 16 JPA entities, Spring Security configs, React components, and database schema scripts.
- [x] Execution of backend JUnit tests (`9/9` passing) and frontend Vite build (`dist/` created).
- [x] Publication of `docs/CAPSTONE_AUDIT.md`, `docs/FEATURE_GAP_ANALYSIS.md`, and `docs/IMPLEMENTATION_PLAN.md`.

### Phase 2: CRUD Refinement & Backend Enhancements
- [ ] Add strict BCrypt password checking for legacy seeded passwords and enhance user validation.
- [ ] Add Room Status check (`MAINTENANCE` / `DIRTY`) in `BookingService.java` to prevent booking non-ready rooms.
- [ ] Add average rating auto-recalculation when a review is submitted in `ReviewService.java`.
- [ ] Ensure owner data segregation: properties, rooms, and staff restricted to authorized owners.

### Phase 3: Differentiating Smart Features Implementation
- [ ] **StayWise Smart Stay Engine & Match Score**: Add backend endpoint `/api/smart-stay/recommend` and integrated UI modal in `Hotels.jsx`.
- [ ] **Personal Budget Guard**: Add tax and fee breakdowns with budget warning badge in room booking dialogs.
- [ ] **Refund & Cancellation Simulator**: Add refund estimator endpoint `/api/bookings/{id}/cancellation-refund-estimate` and display in `MyBookings.jsx`.
- [ ] **Tamil & English Guest Assistant**: Add `/api/assistant/chat` with language toggle (Tamil / English) in frontend widget.
- [ ] **Room Readiness & Maintenance Management**: Add maintenance toggle controls in `OwnerDashboard.jsx`.
- [ ] **Owner Analytics Dashboard**: Add revenue summaries, occupancy %, and booking count metrics to `OwnerDashboard.jsx`.
- [ ] **Booking Audit Trail**: Log booking creation, cancellation, and status changes in database.

### Phase 4: Frontend Polish & End-to-End Journey
- [ ] Enhance stay journey UI (`Home.jsx`, `Hotels.jsx`, `HotelDetails.jsx`, `MyBookings.jsx`, `PaymentPage.jsx`, `InvoicePage.jsx`, `OwnerDashboard.jsx`).
- [ ] Provide clear error banners, loading indicators, and form validations.

### Phase 5: Automated Testing & Security Verification
- [ ] Add JUnit tests for Smart Stay Engine, Budget Guard, Cancellation Refund calculation, and Maintenance restrictions.
- [ ] Verify environment configuration file `.env.example`.

### Phase 6: Documentation & Deliverables
- [ ] Update `README.md`, `CHANGELOG.md`, `LICENSE`, and create Capstone Acceptance Checklist.
