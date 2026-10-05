package com.backend.bookadoctor.service;

import com.backend.bookadoctor.entity.Appointment;
import com.backend.bookadoctor.entity.Doctor;
import com.backend.bookadoctor.entity.User;
import com.backend.bookadoctor.repository.AppointmentRepository;
import com.backend.bookadoctor.repository.DoctorRepository;
import com.backend.bookadoctor.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    // ==========================================
    // BOOK APPOINTMENT
    // ==========================================

    public Appointment bookAppointment(
            Long patientId,
            Long doctorId,
            Appointment appointment) {

        // Find patient
        User patient = userRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        // Find doctor
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        // Set patient
        appointment.setPatient(patient);

        // Set doctor
        appointment.setDoctor(doctor);

        // Default status
        if (appointment.getStatus() == null ||
                appointment.getStatus().isBlank()) {

            appointment.setStatus("Booked");
        }

        return appointmentRepository.save(appointment);
    }

    // ==========================================
    // GET PATIENT APPOINTMENTS
    // ==========================================

    public List<Appointment> getPatientAppointments(
            Long patientId) {

        if (!userRepository.existsById(patientId)) {
            throw new RuntimeException("Patient not found");
        }

        return appointmentRepository.findByPatientId(patientId);
    }

    // ==========================================
    // GET DOCTOR APPOINTMENTS
    // ==========================================

    public List<Appointment> getDoctorAppointments(
            Long doctorId) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new RuntimeException("Doctor not found");
        }

        return appointmentRepository.findByDoctorId(doctorId);
    }

    // ==========================================
    // GET ALL APPOINTMENTS - ADMIN
    // ==========================================

    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();
    }

    // ==========================================
    // CANCEL MY APPOINTMENT
    // ==========================================

    public Appointment cancelAppointment(
            Long appointmentId,
            Long patientId) {

        /*
         * IMPORTANT:
         * Find appointment using BOTH:
         *
         * appointment ID
         * +
         * patient ID
         *
         * Therefore a user cannot cancel
         * another user's appointment.
         */

        Appointment appointment =
                appointmentRepository
                        .findByIdAndPatientId(
                                appointmentId,
                                patientId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Appointment not found or does not belong to you"
                                ));

        // Change status
        appointment.setStatus("Cancelled");

        // Save changes
        return appointmentRepository.save(appointment);
    }
}