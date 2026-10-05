package com.backend.bookadoctor.controller;

import com.backend.bookadoctor.dto.LoginRequest;
import com.backend.bookadoctor.dto.LoginResponse;
import com.backend.bookadoctor.entity.User;
import com.backend.bookadoctor.security.JwtService;
import com.backend.bookadoctor.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(
            UserService userService,
            JwtService jwtService) {

        this.userService = userService;
        this.jwtService = jwtService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
            @RequestBody User user) {

        try {

            User savedUser =
                    userService.registerUser(user);

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "message",
                    "Registration successful"
            );

            response.put(
                    "id",
                    savedUser.getId()
            );

            response.put(
                    "name",
                    savedUser.getName()
            );

            response.put(
                    "email",
                    savedUser.getEmail()
            );

            response.put(
                    "role",
                    savedUser.getRole()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(error);
        }
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            User user =
                    userService.loginUser(
                            request.getEmail(),
                            request.getPassword()
                    );

            String token =
                    jwtService.generateToken(
                            user.getEmail(),
                            user.getRole()
                    );

            LoginResponse response =
                    new LoginResponse(
                            "Login successful",
                            token,
                            user
                    );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error);
        }
    }
}