package com.backend.bookadoctor.service;

import com.backend.bookadoctor.entity.Doctor;
import com.backend.bookadoctor.entity.Review;
import com.backend.bookadoctor.entity.User;
import com.backend.bookadoctor.repository.DoctorRepository;
import com.backend.bookadoctor.repository.ReviewRepository;
import com.backend.bookadoctor.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            UserRepository userRepository,
            DoctorRepository doctorRepository) {

        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    // ADD REVIEW
    public Review addReview(
            Long patientId,
            Long doctorId,
            Integer rating,
            String comment) {

        if (rating == null || rating < 1 || rating > 5) {
            throw new RuntimeException(
                    "Rating must be between 1 and 5");
        }

        if (reviewRepository.existsByDoctorIdAndPatientId(
                doctorId,
                patientId)) {

            throw new RuntimeException(
                    "You have already reviewed this doctor");
        }

        User patient = userRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"));

        Review review = new Review();

        review.setPatient(patient);
        review.setDoctor(doctor);
        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    // GET REVIEWS FOR DOCTOR
    public List<Review> getDoctorReviews(Long doctorId) {

        return reviewRepository.findByDoctorId(doctorId);
    }

    // GET REVIEWS WRITTEN BY LOGGED-IN PATIENT
    public List<Review> getPatientReviews(Long patientId) {

        return reviewRepository.findByPatientId(patientId);
    }

    // DELETE ONLY OWN REVIEW
    public void deleteReview(
            Long reviewId,
            Long patientId) {

        Review review =
                reviewRepository.findByIdAndPatientId(
                        reviewId,
                        patientId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Review not found or does not belong to you"
                        ));

        reviewRepository.delete(review);
    }
}