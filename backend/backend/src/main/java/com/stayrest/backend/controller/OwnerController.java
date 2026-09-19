package com.stayrest.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/owner")
public class OwnerController {

    @GetMapping("/test")
    public String ownerTest() {
        return "OWNER access granted successfully!";
    }
}