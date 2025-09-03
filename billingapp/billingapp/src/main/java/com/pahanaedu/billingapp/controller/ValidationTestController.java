package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.dto.CreateUserRequest;
import com.pahanaedu.billingapp.dto.UpdateUserRequest;
import com.pahanaedu.billingapp.dto.ChangePasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/validation-test")
@Tag(name = "Validation Test", description = "Endpoints to demonstrate validation errors")
public class ValidationTestController {

    @PostMapping("/create-user-validation")
    @Operation(summary = "Test Create User Validation", 
               description = "This endpoint demonstrates validation errors for user creation. Try sending invalid data to see validation responses.")
    public ResponseEntity<Map<String, String>> testCreateUserValidation(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(Map.of("message", "Validation passed - user would be created"));
    }

    @PutMapping("/update-user-validation")
    @Operation(summary = "Test Update User Validation",
               description = "This endpoint demonstrates validation errors for user updates. Try sending invalid email format to see validation responses.")
    public ResponseEntity<Map<String, String>> testUpdateUserValidation(@Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(Map.of("message", "Validation passed - user would be updated"));
    }

    @PostMapping("/password-validation")
    @Operation(summary = "Test Password Change Validation",
               description = "This endpoint demonstrates validation errors for password changes. Try sending short passwords to see validation responses.")
    public ResponseEntity<Map<String, String>> testPasswordValidation(@Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(Map.of("message", "Validation passed - password would be changed"));
    }

    @GetMapping("/validation-examples")
    @Operation(summary = "Get Validation Examples",
               description = "Returns examples of validation scenarios you can test")
    public ResponseEntity<Map<String, Object>> getValidationExamples() {
        return ResponseEntity.ok(Map.of(
            "createUserInvalidExamples", Map.of(
                "missingUsername", Map.of(
                    "username", "",
                    "password", "password123",
                    "fullName", "Test User",
                    "email", "test@example.com",
                    "phone", "1234567890",
                    "role", "ROLE_USER"
                ),
                "shortPassword", Map.of(
                    "username", "testuser",
                    "password", "123",
                    "fullName", "Test User",
                    "email", "test@example.com",
                    "phone", "1234567890",
                    "role", "ROLE_USER"
                ),
                "invalidEmail", Map.of(
                    "username", "testuser",
                    "password", "password123",
                    "fullName", "Test User",
                    "email", "invalid-email",
                    "phone", "1234567890",
                    "role", "ROLE_USER"
                ),
                "missingRole", Map.of(
                    "username", "testuser",
                    "password", "password123",
                    "fullName", "Test User",
                    "email", "test@example.com",
                    "phone", "1234567890",
                    "role", ""
                )
            ),
            "updateUserInvalidExamples", Map.of(
                "invalidEmail", Map.of(
                    "fullName", "Updated Name",
                    "email", "not-an-email",
                    "phone", "1234567890"
                )
            ),
            "passwordInvalidExamples", Map.of(
                "shortPassword", Map.of(
                    "password", "123"
                ),
                "emptyPassword", Map.of(
                    "password", ""
                )
            )
        ));
    }
}
