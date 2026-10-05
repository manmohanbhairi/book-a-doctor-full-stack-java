package com.backend.bookadoctor.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @GetMapping
    public Map<String, Object> getProfile(
            Authentication authentication) {

        Map<String, Object> response = new HashMap<>();

        response.put("message", "You are authenticated");
        response.put("email", authentication.getName());
        response.put("authorities", authentication.getAuthorities());

        return response;
    }
}