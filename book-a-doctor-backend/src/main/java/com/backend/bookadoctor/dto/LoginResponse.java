package com.backend.bookadoctor.dto;

import com.backend.bookadoctor.entity.User;

public class LoginResponse {

    private String message;
    private String token;
    private Long id;
    private String name;
    private String email;
    private String role;

    public LoginResponse(
            String message,
            String token,
            User user
    ) {
        this.message = message;
        this.token = token;
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole();
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}