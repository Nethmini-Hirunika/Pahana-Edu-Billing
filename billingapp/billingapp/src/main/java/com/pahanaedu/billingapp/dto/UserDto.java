package com.pahanaedu.billingapp.dto;

/** Flat shape returned to the frontend. */
public record UserDto(
        Long id,
        String name,       // maps from User.fullName
        String username,
        String email,
        String phone,
        String role        // single primary role name, e.g. "ADMIN"
) {}

