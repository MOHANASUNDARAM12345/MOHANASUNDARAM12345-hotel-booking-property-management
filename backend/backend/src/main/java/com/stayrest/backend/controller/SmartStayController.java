package com.stayrest.backend.controller;

import com.stayrest.backend.service.SmartStayService;
import com.stayrest.backend.service.SmartStayService.SmartStayRequest;
import com.stayrest.backend.service.SmartStayService.SmartStayRecommendation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/smart-stay")
public class SmartStayController {

    private final SmartStayService smartStayService;

    public SmartStayController(SmartStayService smartStayService) {
        this.smartStayService = smartStayService;
    }

    @PostMapping("/recommend")
    public ResponseEntity<List<SmartStayRecommendation>> getRecommendations(
            @RequestBody SmartStayRequest request) {

        return ResponseEntity.ok(smartStayService.getRecommendations(request));
    }
}
