package com.backend.bookadoctor.repository;

import com.backend.bookadoctor.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository
        extends JpaRepository<Review, Long> {

    List<Review> findByDoctorId(Long doctorId);

    List<Review> findByPatientId(Long patientId);

    boolean existsByDoctorIdAndPatientId(
            Long doctorId,
            Long patientId
    );

    Optional<Review> findByIdAndPatientId(
            Long id,
            Long patientId
    );
}