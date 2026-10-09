package com.backend.bookadoctor.config;

import com.backend.bookadoctor.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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

    // CORS CONFIGURATION
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "https://book-a-doctor-full-stack-java.vercel.app"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    // SECURITY CONFIGURATION
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(
                        corsConfigurationSource()
                ))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // CORS PREFLIGHT
                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

                        // AUTHENTICATION
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // DOCTORS
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/doctors/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/doctors/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/doctors/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/doctors/**"
                        )
                        .hasRole("ADMIN")

                        // PROFILE
                        .requestMatchers("/api/profile")
                        .authenticated()

                        // APPOINTMENTS
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/appointments"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/appointments"
                        )
                        .authenticated()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/appointments/patient"
                        )
                        .authenticated()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/appointments/doctor/**"
                        )
                        .authenticated()

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/appointments/*/cancel"
                        )
                        .authenticated()

                        // FAVORITES
                        .requestMatchers("/api/favorites/**")
                        .authenticated()

                        // REVIEWS
                        .requestMatchers("/api/reviews/**")
                        .authenticated()

                        // EVERYTHING ELSE
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
