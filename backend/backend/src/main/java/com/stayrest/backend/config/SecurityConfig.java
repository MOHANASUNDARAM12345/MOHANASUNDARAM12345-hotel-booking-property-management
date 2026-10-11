package com.stayrest.backend.config;

import com.stayrest.backend.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Value("${app.cors.allowed-origins:}")
    private String allowedOrigins;

    @Value("${app.cors.allowed-origin-patterns:}")
    private String allowedOriginPatterns;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomUserDetailsService customUserDetailsService) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    private static List<String> splitCsv(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(item -> !item.isEmpty())
                .toList();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        List<String> origins = splitCsv(allowedOrigins);
        if (!origins.isEmpty()) {
            config.setAllowedOrigins(origins);
        }

        List<String> patterns = splitCsv(allowedOriginPatterns);
        if (!patterns.isEmpty()) {
            config.setAllowedOriginPatterns(patterns);
        }

        config.setAllowedMethods(
                List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
        );
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(
                List.of("Authorization", "Content-Disposition")
        );

        // Authentication uses a Bearer JWT header, not cookies, so credentials
        // are not required and wildcard * is safe for headers.
        config.setAllowCredentials(false);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(cors ->
                    cors.configurationSource(corsConfigurationSource())
            )

            .csrf(csrf ->
                    csrf.disable()
            )

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .userDetailsService(customUserDetailsService)

            .authorizeHttpRequests(auth -> auth

                // Allow CORS preflight requests to pass through
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public APIs and Swagger
                .requestMatchers(
                        "/api/health",
                        "/api/auth/**",
                        "/v3/api-docs/**",
                        "/swagger-ui/**",
                        "/swagger-ui.html"
                ).permitAll()
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll()

                // Public smart features (no token required by the UI)
                .requestMatchers(
                        HttpMethod.POST,
                        "/api/assistant/**",
                        "/api/smart-stay/**"
                ).permitAll()

                // Public GET APIs
                .requestMatchers(
                        HttpMethod.GET,
                        "/api/hotels/**",
                        "/api/rooms/**",
                        "/api/reviews/**",
                        "/api/coupons/**",
                        "/api/services/**"
                ).permitAll()

                // Favorites - logged-in users
                .requestMatchers("/api/favorites/**")
                .authenticated()

                // OWNER only APIs
                .requestMatchers("/api/owner/**")
                .hasRole("OWNER")

                // All other APIs require login
                .anyRequest()
                .authenticated()
            )

            // Return a JSON body for 401/403 instead of an empty response, so
            // the frontend can show a meaningful message (an empty body used to
            // break the shared response parser).
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(
                            "{\"status\":401,\"error\":\"Unauthorized\","
                                    + "\"message\":\"Authentication is required to access this resource\"}"
                    );
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write(
                            "{\"status\":403,\"error\":\"Forbidden\","
                                    + "\"message\":\"You do not have permission to access this resource\"}"
                    );
                })
            )

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
