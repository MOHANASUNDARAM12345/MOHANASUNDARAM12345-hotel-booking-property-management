package com.stayrest.backend;

import com.stayrest.backend.entity.User;
import com.stayrest.backend.repository.UserRepository;
import com.stayrest.backend.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Spy
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private UserService userService;
    private User sampleUser;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordEncoder);

        sampleUser = new User();
        sampleUser.setUserId(1);
        sampleUser.setName("Test User");
        sampleUser.setEmail("test@stayrest.com");
        sampleUser.setPassword("plainPassword123");
        sampleUser.setRole("USER");
    }

    @Test
    void testSaveUserHashesPassword() {
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User savedUser = userService.saveUser(sampleUser);

        assertNotNull(savedUser);
        assertNotEquals("plainPassword123", savedUser.getPassword());
        assertTrue(passwordEncoder.matches("plainPassword123", savedUser.getPassword()));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testGetUserByEmail() {
        when(userRepository.findByEmail("test@stayrest.com")).thenReturn(Optional.of(sampleUser));

        Optional<User> found = userService.getUserByEmail("test@stayrest.com");

        assertTrue(found.isPresent());
        assertEquals("test@stayrest.com", found.get().getEmail());
    }

    @Test
    void testCheckPassword() {
        String encoded = passwordEncoder.encode("secretPass");
        assertTrue(userService.checkPassword("secretPass", encoded));
        assertFalse(userService.checkPassword("wrongPass", encoded));
    }
}
