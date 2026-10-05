package com.backend.bookadoctor.repository;

import com.backend.bookadoctor.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    // Get all appointments belonging to a patient
    List<Appointment> findByPatientId(Long patientId);

    // Get all appointments for a doctor
    List<Appointment> findByDoctorId(Long doctorId);

    // Find a specific appointment ONLY if it belongs to the patient
    Optional<Appointment> findByIdAndPatientId(
            Long id,
            Long patientId
    );
}