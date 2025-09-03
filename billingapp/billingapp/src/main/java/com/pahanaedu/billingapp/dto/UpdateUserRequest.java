package com.pahanaedu.billingapp.dto;

import jakarta.validation.constraints.Email;

/** All fields optional; only provided ones are updated. */
public record UpdateUserRequest(
        String fullName,
        String Username,
        @Email(message = "Invalid email format", groups = {}) String email,
        String phone,
        String role    // optional new role ("ROLE_ADMIN"/"ROLE_STAFF"/"ROLE_USER")
) {}
