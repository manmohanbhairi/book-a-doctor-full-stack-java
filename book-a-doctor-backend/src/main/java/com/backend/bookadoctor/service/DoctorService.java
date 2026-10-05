package com.backend.bookadoctor.service;

import com.backend.bookadoctor.entity.Doctor;
import com.backend.bookadoctor.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // GET all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // GET doctor by ID
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found with id: " + id));
    }

    // CREATE doctor
    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // UPDATE doctor
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {

        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found with id: " + id));

        existingDoctor.setName(updatedDoctor.getName());
        existingDoctor.setSpecialization(updatedDoctor.getSpecialization());
        existingDoctor.setLocation(updatedDoctor.getLocation());
        existingDoctor.setQualification(updatedDoctor.getQualification());
        existingDoctor.setHospital(updatedDoctor.getHospital());
        existingDoctor.setPhone(updatedDoctor.getPhone());
        existingDoctor.setAbout(updatedDoctor.getAbout());
        existingDoctor.setExperience(updatedDoctor.getExperience());
        existingDoctor.setFee(updatedDoctor.getFee());
        existingDoctor.setRating(updatedDoctor.getRating());
        existingDoctor.setImage(updatedDoctor.getImage());
        existingDoctor.setAvailable(updatedDoctor.getAvailable());
        existingDoctor.setAvailableDays(updatedDoctor.getAvailableDays());
        existingDoctor.setAvailableSlots(updatedDoctor.getAvailableSlots());

        return doctorRepository.save(existingDoctor);
    }

    // DELETE doctor
    public void deleteDoctor(Long id) {

        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found with id: " + id));

        doctorRepository.delete(existingDoctor);
    }
}