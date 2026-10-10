package com.stayrest.backend.controller;

import com.stayrest.backend.service.OwnerAnalyticsService;
import com.stayrest.backend.service.OwnerAnalyticsService.OwnerAnalyticsResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner/analytics")
public class OwnerAnalyticsController {

    private final OwnerAnalyticsService ownerAnalyticsService;

    public OwnerAnalyticsController(OwnerAnalyticsService ownerAnalyticsService) {
        this.ownerAnalyticsService = ownerAnalyticsService;
    }

    @GetMapping
    public ResponseEntity<OwnerAnalyticsResponse> getAnalytics(
            @RequestParam(required = false) Integer ownerId) {

        return ResponseEntity.ok(ownerAnalyticsService.getAnalytics(ownerId));
    }
}
