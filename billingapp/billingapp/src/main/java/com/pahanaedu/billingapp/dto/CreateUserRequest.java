package com.pahanaedu.billingapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
        @NotBlank(message = "Username is required") String username,
        @NotBlank(message = "Password is required") @Size(min = 6, message = "Password must be at least 6 characters")
        String password,
        @NotBlank(message = "Full name is required") String fullName,
        @Email(message = "Invalid email format") String email,
        String phone,
        @NotBlank(message = "Role is required") String role   // "ROLE_ADMIN", "ROLE_STAFF", "ROLE_USER"
) {}
