package com.backend.bookadoctor.service;

import com.backend.bookadoctor.entity.User;
import com.backend.bookadoctor.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTER
    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException(
                    "Email already registered");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        // IMPORTANT:
        // Every new registration is always a normal user.
        // The client cannot create an admin account.
        user.setRole("user");

        return userRepository.save(user);
    }

    // FIND USER BY EMAIL
    public User findByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));
    }

    // LOGIN
    public User loginUser(
            String email,
            String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"));

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password");
        }

        return user;
    }
}