package com.backend.bookadoctor.service;

import com.backend.bookadoctor.entity.Doctor;
import com.backend.bookadoctor.entity.Favorite;
import com.backend.bookadoctor.entity.User;
import com.backend.bookadoctor.repository.DoctorRepository;
import com.backend.bookadoctor.repository.FavoriteRepository;
import com.backend.bookadoctor.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public FavoriteService(
            FavoriteRepository favoriteRepository,
            UserRepository userRepository,
            DoctorRepository doctorRepository) {

        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    // ==========================================
    // ADD FAVORITE
    // ==========================================

    public Favorite addFavorite(
            Long patientId,
            Long doctorId) {

        // Check whether doctor is already a favorite
        if (favoriteRepository
                .existsByPatientIdAndDoctorId(
                        patientId,
                        doctorId)) {

            throw new RuntimeException(
                    "Doctor already added to favorites");
        }

        // Find patient
        User patient = userRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"));

        // Find doctor
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"));

        Favorite favorite = new Favorite();

        favorite.setPatient(patient);
        favorite.setDoctor(doctor);

        return favoriteRepository.save(favorite);
    }

    // ==========================================
    // GET MY FAVORITES
    // ==========================================

    public List<Favorite> getFavorites(
            Long patientId) {

        // Make sure patient exists
        if (!userRepository.existsById(patientId)) {
            throw new RuntimeException(
                    "Patient not found");
        }

        /*
         * Only favorites belonging to this
         * authenticated patient are returned.
         */
        return favoriteRepository.findByPatientId(patientId);
    }

    // ==========================================
    // REMOVE MY FAVORITE
    // ==========================================

    public void removeFavorite(
            Long patientId,
            Long doctorId) {

        /*
         * Find favorite using BOTH:
         *
         * patient ID
         * +
         * doctor ID
         *
         * Therefore a user cannot remove
         * another user's favorite.
         */
        Favorite favorite =
                favoriteRepository
                        .findByPatientIdAndDoctorId(
                                patientId,
                                doctorId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Favorite not found or does not belong to you"
                                ));

        favoriteRepository.delete(favorite);
    }
}