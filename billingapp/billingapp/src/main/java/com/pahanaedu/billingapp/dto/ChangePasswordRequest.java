package com.pahanaedu.billingapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
        String password
) {}

