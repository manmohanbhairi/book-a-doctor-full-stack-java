package com.backend.bookadoctor.repository;

import com.backend.bookadoctor.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository
        extends JpaRepository<Favorite, Long> {

    // Get all favorites belonging to a patient
    List<Favorite> findByPatientId(Long patientId);

    // Find a specific favorite belonging to a specific patient
    Optional<Favorite> findByPatientIdAndDoctorId(
            Long patientId,
            Long doctorId
    );

    // Check whether this patient already favorited this doctor
    boolean existsByPatientIdAndDoctorId(
            Long patientId,
            Long doctorId
    );
}