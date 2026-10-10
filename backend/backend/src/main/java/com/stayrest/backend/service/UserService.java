package com.stayrest.backend.service;

import com.stayrest.backend.entity.User;
import com.stayrest.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User saveUser(User user) {
        if (user.getEmail() != null && emailExists(user.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        }

        if (user.getCreatedAt() == null) {
            user.setCreatedAt(java.time.LocalDateTime.now());
        }

        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(user);
    }

    public Optional<User> getUserByEmail(String email) {

        return userRepository.findByEmail(email);
    }

    public boolean emailExists(String email) {

        return userRepository.existsByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        if (encodedPassword != null && (encodedPassword.startsWith("$2a$") || encodedPassword.startsWith("$2b$") || encodedPassword.startsWith("$2y$"))) {
            return passwordEncoder.matches(rawPassword, encodedPassword);
        }
        return rawPassword != null && rawPassword.equals(encodedPassword);
    }
}