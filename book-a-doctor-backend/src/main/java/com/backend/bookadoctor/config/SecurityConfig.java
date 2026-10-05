package com.backend.bookadoctor.config;

import com.backend.bookadoctor.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        // ==========================================
                        // CORS PREFLIGHT
                        // ==========================================

                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

                        // ==========================================
                        // AUTHENTICATION
                        // ==========================================

                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // ==========================================
                        // DOCTORS
                        // ==========================================

                        // Anyone can view doctors
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/doctors/**"
                        )
                        .permitAll()

                        // Only ADMIN can add doctors
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/doctors/**"
                        )
                        .hasRole("ADMIN")

                        // Only ADMIN can update doctors
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/doctors/**"
                        )
                        .hasRole("ADMIN")

                        // Only ADMIN can delete doctors
                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/doctors/**"
                        )
                        .hasRole("ADMIN")

                        // ==========================================
                        // PROFILE
                        // ==========================================

                        .requestMatchers("/api/profile")
                        .authenticated()

                        // ==========================================
                        // APPOINTMENTS
                        // ==========================================

                        // Only ADMIN can view ALL appointments
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/appointments"
                        )
                        .hasRole("ADMIN")

                        // Logged-in users can book appointments
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/appointments"
                        )
                        .authenticated()

                        // Logged-in users can view their appointments
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/appointments/patient"
                        )
                        .authenticated()

                        // Logged-in users can view doctor appointments
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/appointments/doctor/**"
                        )
                        .authenticated()

                        // Logged-in users can cancel their own appointments
                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/appointments/*/cancel"
                        )
                        .authenticated()

                        // ==========================================
                        // FAVORITES
                        // ==========================================

                        .requestMatchers("/api/favorites/**")
                        .authenticated()

                        // ==========================================
                        // REVIEWS
                        // ==========================================

                        .requestMatchers("/api/reviews/**")
                        .authenticated()

                        // ==========================================
                        // EVERYTHING ELSE
                        // ==========================================

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}