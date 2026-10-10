# Feature Gap Analysis & Prioritization Matrix

**Project**: Hotel Booking and Property Management System (StayRest)  
**Date**: October 9, 2026  

---

## 1. Differentiating Features Gap Evaluation

| Feature ID & Name | Business Value | Implementation Complexity | DB Changes Required | Dependencies | Security Risk | Capstone Relevance | Status | Priority |
|---|---|---|---|---|---|---|---|---|
| **A. StayWise Smart Stay Engine** | High | Medium | None | Database hotel records | Low | High | MISSING | **P1 (High)** |
| **B. Personal Budget Guard** | High | Low | None | Booking price engine | Low | High | PARTIAL | **P1 (High)** |
| **C. Explainable Match Score** | High | Medium | None | StayWise Engine | Low | High | MISSING | **P1 (High)** |
| **D. Flexible-Date Savings Finder** | Medium | Medium | None | Booking & Room rates | Low | Medium | MISSING | **P2 (Med)** |
| **E. Refund & Cancellation Simulator** | High | Low | None | Cancellation policy rules | Low | High | MISSING | **P1 (High)** |
| **F. Group Trip Decision Room** | Low | High | New Tables | User sessions | Medium | Low | Out of Core Scope | **P3 (Low)** |
| **G. Accessibility Fit Checker** | High | Low | Column additions | Hotel details | Low | High | MISSING | **P2 (Med)** |
| **H. Tamil & English Guest Assistant** | High | Medium | None | Knowledge base & deterministic rules | Low | High | MISSING | **P1 (High)** |
| **I. Room Readiness & Maintenance** | High | Low | Status field in Rooms | Room entity | Low | High | PARTIAL | **P1 (High)** |
| **J. Owner Decision Dashboard** | High | Medium | Aggregation queries | Bookings & Payments | Low | High | PARTIAL | **P1 (High)** |
| **K. Complaint-to-Resolution Tracker** | Medium | Medium | New Table (`requests`) | Support system | Low | Medium | MISSING | **P2 (Med)** |
| **L. Booking Change Audit Trail** | High | Low | New Table (`audit_logs`) | Booking updates | Low | High | MISSING | **P1 (High)** |
| **M. Booking Disruption Recovery** | Medium | High | Disruption logs | Maintenance status | Low | Medium | MISSING | **P3 (Low)** |
| **N. Review Evidence Explorer** | Medium | Low | Keyword taxonomy | Reviews entity | Low | Medium | MISSING | **P2 (Med)** |
| **O. End-to-End Stay Journey** | High | Medium | None | Frontend flow link | Low | High | PARTIAL | **P1 (High)** |

---

## 2. Mandatory vs. Optional Feature Selection

### High Priority Selected Features for Implementation:
1. **StayWise Smart Stay Engine + Explainable Match Score**: Deterministic multi-factor scoring algorithm (Budget, Location, Rating, Amenities) with transparent explanation breakdown.
2. **Personal Budget Guard**: Real-time total cost vs user budget comparison with tax breakdown and lower-cost recommendation.
3. **Refund & Cancellation Simulator**: Transparent calculation of refund amounts based on check-in date proximity and booking status.
4. **Tamil & English Guest Assistant**: Bilingual query responder for booking policies, check-in rules, and hotel information with zero external AI dependence.
5. **Room Readiness & Maintenance Management**: Operational status tracking (`CLEAN`, `DIRTY`, `UNDER_MAINTENANCE`) restricting non-ready rooms from booking.
6. **Owner Decision Dashboard**: Revenue analytics, occupancy rates, total bookings, and cancellation metrics for property owners.
7. **Booking Audit Trail**: Log of status transitions, price changes, and cancellations with actor timestamps.
