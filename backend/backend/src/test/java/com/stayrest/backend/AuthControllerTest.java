package com.stayrest.backend;

import com.stayrest.backend.controller.AuthController;
import com.stayrest.backend.entity.User;
import com.stayrest.backend.service.AuthService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Test
    void registerReturnsUserResponseWithoutPassword() {
        AuthService authService = mock(AuthService.class);
        User registeredUser = new User();
        registeredUser.setUserId(7);
        registeredUser.setName("StayRest Guest");
        registeredUser.setEmail("guest@example.com");
        registeredUser.setPhone("5551234567");
        registeredUser.setRole("USER");
        registeredUser.setPassword("$2a$12$stored-password-hash");
        when(authService.register(registeredUser)).thenReturn(registeredUser);

        AuthController controller = new AuthController(authService);
        UserResponse response = controller.register(registeredUser).getBody();

        assertEquals(7, response.getUserId());
        assertEquals("guest@example.com", response.getEmail());
        assertEquals("USER", response.getRole());
    }
}