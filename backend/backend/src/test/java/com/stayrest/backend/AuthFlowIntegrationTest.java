package com.stayrest.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * End-to-end verification of the signup/login/JWT flow against the real Spring
 * security filter chain (H2 test profile). Covers the scenarios the frontend
 * depends on: valid signup, duplicate email, valid login, wrong password and
 * invalid/expired tokens.
 */
@SpringBootTest
@AutoConfigureMockMvc
class AuthFlowIntegrationTest {

    private static final String JWT_SECRET =
            "test-only-secret-key-that-is-long-enough-1234567890";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String registerBody(String email) {
        return "{\"name\":\"Perf Tester\",\"email\":\"" + email
                + "\",\"password\":\"password123\",\"phone\":\"5551234567\",\"role\":\"USER\"}";
    }

    private String loginBody(String email, String password) {
        return "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
    }

    @Test
    void signupDuplicateLoginAndInvalidPassword() throws Exception {
        String email = "perf.valid." + System.nanoTime() + "@example.com";

        // 1. Valid signup returns a response without any password field.
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody(email)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.password").doesNotExist());

        // 2. Duplicate email is rejected with 400 and a clear message.
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody(email)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email already registered"));

        // 3. Valid login issues a token/role/userId in a single response.
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody(email, "password123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.userId").isNumber())
                .andReturn();

        JsonNode loginJson =
                objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = loginJson.get("token").asText();

        // 4. The issued token grants access to a protected endpoint.
        mockMvc.perform(get("/api/users/email/" + email)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // 5. Invalid password is rejected with 401.
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody(email, "wrong-password")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidAndExpiredTokensAreRejected() throws Exception {
        String email = "perf.token." + System.nanoTime() + "@example.com";

        // Malformed token -> 401, no authenticated context.
        mockMvc.perform(get("/api/users/email/" + email)
                        .header("Authorization", "Bearer not-a-real-token"))
                .andExpect(status().isUnauthorized());

        // Correctly signed but expired token -> 401.
        SecretKey key =
                Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
        String expiredToken = Jwts.builder()
                .subject(email)
                .issuedAt(new Date(System.currentTimeMillis() - 7_200_000L))
                .expiration(new Date(System.currentTimeMillis() - 3_600_000L))
                .signWith(key)
                .compact();

        mockMvc.perform(get("/api/users/email/" + email)
                        .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }
}
