package com.backend.bookadoctor.controller;

import com.backend.bookadoctor.entity.Review;
import com.backend.bookadoctor.entity.User;
import com.backend.bookadoctor.repository.UserRepository;
import com.backend.bookadoctor.service.ReviewService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public ReviewController(
            ReviewService reviewService,
            UserRepository userRepository) {

        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    // ADD REVIEW
    @PostMapping
    public Review addReview(
            @RequestParam Long doctorId,
            @RequestParam Integer rating,
            @RequestParam String comment,
            Authentication authentication) {

        User user = userRepository.findByEmail(
                        authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        return reviewService.addReview(
                user.getId(),
                doctorId,
                rating,
                comment
        );
    }

    // GET DOCTOR REVIEWS
    @GetMapping("/doctor/{doctorId}")
    public List<Review> getDoctorReviews(
            @PathVariable Long doctorId) {

        return reviewService.getDoctorReviews(doctorId);
    }

    // GET MY REVIEWS
    @GetMapping("/patient")
    public List<Review> getMyReviews(
            Authentication authentication) {

        User user = userRepository.findByEmail(
                        authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        return reviewService.getPatientReviews(
                user.getId()
        );
    }

    // DELETE ONLY MY REVIEW
    @DeleteMapping("/{id}")
    public String deleteReview(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findByEmail(
                        authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        reviewService.deleteReview(
                id,
                user.getId()
        );

        return "Review deleted successfully";
    }
}