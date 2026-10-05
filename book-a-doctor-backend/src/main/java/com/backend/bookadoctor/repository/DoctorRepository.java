package com.backend.bookadoctor.repository;

import com.backend.bookadoctor.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    List<Doctor> findBySpecializationContainingIgnoreCase(
            String specialization
    );

    List<Doctor> findByLocationContainingIgnoreCase(
            String location
    );
}