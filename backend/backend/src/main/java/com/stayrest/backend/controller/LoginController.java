package com.stayrest.backend.controller;

import com.stayrest.backend.LoginRequest;
import com.stayrest.backend.entity.User;
import com.stayrest.backend.service.JwtService;
import com.stayrest.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final UserService userService;
    private final JwtService jwtService;

    public LoginController(UserService userService,
                           JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        User user = userService.getUserByEmail(loginRequest.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        boolean passwordCorrect = userService.checkPassword(
                loginRequest.getPassword(),
                user.getPassword()
        );

        if (!passwordCorrect) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Login successful");
        response.put("token", token);
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }
}