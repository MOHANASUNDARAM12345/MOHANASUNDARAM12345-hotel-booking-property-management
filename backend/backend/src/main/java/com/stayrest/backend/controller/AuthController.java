package com.stayrest.backend.controller;

import com.stayrest.backend.UserResponse;
import com.stayrest.backend.entity.User;
import com.stayrest.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody User user) {
        User registeredUser = authService.register(user);
        UserResponse response = new UserResponse(
                registeredUser.getUserId(),
                registeredUser.getName(),
                registeredUser.getEmail(),
                registeredUser.getPhone(),
                registeredUser.getRole()
        );
        return ResponseEntity.ok(response);
    }
}