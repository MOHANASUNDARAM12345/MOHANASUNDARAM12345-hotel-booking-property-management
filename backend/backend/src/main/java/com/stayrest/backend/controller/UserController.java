package com.stayrest.backend.controller;

import com.stayrest.backend.UserResponse;
import com.stayrest.backend.entity.User;
import com.stayrest.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody User user) {
        if (user.getName() == null || user.getName().trim().isEmpty() ||
            user.getEmail() == null || user.getEmail().trim().isEmpty() ||
            user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Name, email, and password are required fields");
        }

        User savedUser = userService.saveUser(user);

        UserResponse response = new UserResponse(
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getRole()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(
            @PathVariable String email) {

        return userService.getUserByEmail(email)
                .map(user -> new UserResponse(
                        user.getUserId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getRole()
                ))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}