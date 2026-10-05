package com.backend.bookadoctor.controller;

import com.backend.bookadoctor.entity.Appointment;
import com.backend.bookadoctor.entity.User;
import com.backend.bookadoctor.repository.UserRepository;
import com.backend.bookadoctor.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    public AppointmentController(
            AppointmentService appointmentService,
            UserRepository userRepository) {

        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
    }

    // ==========================================
    // BOOK APPOINTMENT
    // ==========================================

    @PostMapping
    public ResponseEntity<Appointment> bookAppointment(
            @RequestParam Long doctorId,
            @RequestBody Appointment appointment,
            Authentication authentication) {

        // Get logged-in user from JWT
        User user = userRepository.findByEmail(
                        authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        /*
         * IMPORTANT:
         * We do NOT accept patientId from frontend.
         *
         * The patient is always taken from
         * the authenticated JWT user.
         */

        Appointment savedAppointment =
                appointmentService.bookAppointment(
                        user.getId(),
                        doctorId,
                        appointment
                );

        return ResponseEntity.ok(savedAppointment);
    }

    // ==========================================
    // GET ALL APPOINTMENTS - ADMIN ONLY
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {

        /*
         * SecurityConfig protects this endpoint
         * with hasRole("ADMIN").
         *
         * Normal users cannot access it.
         */

        List<Appointment> appointments =
                appointmentService.getAllAppointments();

        return ResponseEntity.ok(appointments);
    }

    // ==========================================
    // GET MY APPOINTMENTS
    // ==========================================

    @GetMapping("/patient")
    public ResponseEntity<List<Appointment>> getMyAppointments(
            Authentication authentication) {

        // Get logged-in user from JWT
        User user = userRepository.findByEmail(
                        authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        /*
         * Only this user's ID is used.
         * Frontend cannot provide another patientId.
         */

        List<Appointment> appointments =
                appointmentService.getPatientAppointments(
                        user.getId()
                );

        return ResponseEntity.ok(appointments);
    }

    // ==========================================
    // GET DOCTOR APPOINTMENTS
    // ==========================================

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(
            @PathVariable Long doctorId) {

        List<Appointment> appointments =
                appointmentService.getDoctorAppointments(
                        doctorId
                );

        return ResponseEntity.ok(appointments);
    }

    // ==========================================
    // CANCEL MY APPOINTMENT
    // ==========================================

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication) {

        // Get logged-in user from JWT
        User user = userRepository.findByEmail(
                        authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Authenticated user not found"));

        /*
         * Service checks:
         *
         * appointment ID
         * +
         * logged-in user's ID
         *
         * So users cannot cancel someone else's
         * appointment.
         */

        Appointment cancelledAppointment =
                appointmentService.cancelAppointment(
                        id,
                        user.getId()
                );

        return ResponseEntity.ok(cancelledAppointment);
    }
}