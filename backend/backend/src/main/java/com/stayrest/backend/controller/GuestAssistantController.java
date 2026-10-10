package com.stayrest.backend.controller;

import com.stayrest.backend.service.GuestAssistantService;
import com.stayrest.backend.service.GuestAssistantService.AssistantRequest;
import com.stayrest.backend.service.GuestAssistantService.AssistantResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
public class GuestAssistantController {

    private final GuestAssistantService guestAssistantService;

    public GuestAssistantController(GuestAssistantService guestAssistantService) {
        this.guestAssistantService = guestAssistantService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AssistantResponse> processChat(@RequestBody AssistantRequest request) {
        return ResponseEntity.ok(guestAssistantService.processQuery(request));
    }
}
