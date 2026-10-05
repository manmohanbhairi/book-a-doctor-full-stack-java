package com.backend.bookadoctor.controller;

import com.backend.bookadoctor.entity.Favorite;
import com.backend.bookadoctor.entity.User;
import com.backend.bookadoctor.repository.UserRepository;
import com.backend.bookadoctor.service.FavoriteService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository;

    public FavoriteController(
            FavoriteService favoriteService,
            UserRepository userRepository) {

        this.favoriteService = favoriteService;
        this.userRepository = userRepository;
    }

    // ==========================================
    // ADD FAVORITE
    // ==========================================

    @PostMapping
    public Favorite addFavorite(
            @RequestParam Long doctorId,
            Authentication authentication) {

        // Get logged-in user from JWT
        User user = userRepository.findByEmail(
                        authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        /*
         * IMPORTANT:
         *
         * patientId is NOT accepted from frontend.
         *
         * The patient is always taken from
         * the authenticated JWT.
         */

        return favoriteService.addFavorite(
                user.getId(),
                doctorId
        );
    }

    // ==========================================
    // GET MY FAVORITES
    // ==========================================

    @GetMapping("/patient")
    public List<Favorite> getMyFavorites(
            Authentication authentication) {

        // Get logged-in user from JWT
        User user = userRepository.findByEmail(
                        authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        /*
         * Only this user's favorites are returned.
         */
        return favoriteService.getFavorites(
                user.getId()
        );
    }

    // ==========================================
    // REMOVE MY FAVORITE
    // ==========================================

    @DeleteMapping
    public String removeFavorite(
            @RequestParam Long doctorId,
            Authentication authentication) {

        // Get logged-in user from JWT
        User user = userRepository.findByEmail(
                        authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        /*
         * Service checks patient ID + doctor ID.
         *
         * Therefore a user can only remove
         * their own favorite.
         */

        favoriteService.removeFavorite(
                user.getId(),
                doctorId
        );

        return "Doctor removed from favorites";
    }
}