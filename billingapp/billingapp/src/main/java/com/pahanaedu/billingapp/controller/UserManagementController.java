package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.dto.ChangePasswordRequest;
import com.pahanaedu.billingapp.dto.CreateUserRequest;
import com.pahanaedu.billingapp.dto.UpdateUserRequest;
import com.pahanaedu.billingapp.dto.UserDto;
import com.pahanaedu.billingapp.model.Role;
import com.pahanaedu.billingapp.model.User;
import com.pahanaedu.billingapp.repository.RoleRepository;
import com.pahanaedu.billingapp.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "Complete user management operations")
@SecurityRequirement(name = "basicAuth")
public class UserManagementController {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    // Helper methods
    private static String firstRoleName(User u) {
        if (u.getRoles() == null || u.getRoles().isEmpty()) return "USER";
        return u.getRoles().iterator().next().getName();
    }

    private static UserDto toDto(User u) {
        return new UserDto(
                u.getId(),
                u.getFullName(),
                u.getUsername(),
                u.getEmail(),
                u.getPhone(),
                firstRoleName(u)
        );
    }

    private Role resolveRoleOrThrow(String name) {
        return roleRepo.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + name));
    }

    // Public endpoints (no authentication required)
    
    @GetMapping("/public/count")
    @Operation(summary = "Get total user count", description = "Returns the total number of registered users")
    @ApiResponse(responseCode = "200", description = "User count retrieved successfully")
    public ResponseEntity<Long> getUserCount() {
        return ResponseEntity.ok(userRepo.count());
    }

    // Authenticated user endpoints

    @GetMapping("/profile")
    @Operation(summary = "Get current user profile", description = "Returns the profile of the currently authenticated user")
    @ApiResponse(responseCode = "200", description = "Profile retrieved successfully")
    @ApiResponse(responseCode = "401", description = "User not authenticated")
    public ResponseEntity<UserDto> getCurrentUserProfile(@AuthenticationPrincipal UserDetails principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepo.findByUsername(principal.getUsername())
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(toDto(user));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile", description = "Updates the profile of the currently authenticated user")
    @ApiResponse(responseCode = "200", description = "Profile updated successfully")
    @ApiResponse(responseCode = "401", description = "User not authenticated")
    public ResponseEntity<UserDto> updateCurrentUserProfile(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody UpdateUserRequest request) {
        
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepo.findByUsername(principal.getUsername())
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName());
        }
        if (request.email() != null && !request.email().isBlank()) {
            user.setEmail(request.email());
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            user.setPhone(request.phone());
        }
        
        User saved = userRepo.save(user);
        return ResponseEntity.ok(toDto(saved));
    }

    @PatchMapping("/profile/password")
    @Operation(summary = "Change current user password", description = "Changes the password of the currently authenticated user")
    @ApiResponse(responseCode = "204", description = "Password changed successfully")
    @ApiResponse(responseCode = "401", description = "User not authenticated")
    public ResponseEntity<Void> changeCurrentUserPassword(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        
        User user = userRepo.findByUsername(principal.getUsername())
                .orElse(null);
        
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        
        user.setPassword(passwordEncoder.encode(request.password()));
        userRepo.save(user);
        
        return ResponseEntity.noContent().build();
    }

    // Admin-only endpoints

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all users", description = "Returns a paginated list of all users (Admin only)")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    public Page<UserDto> listUsers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Search query (username, fullName, or email)") @RequestParam(defaultValue = "") String q,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "id") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        if (q == null || q.isBlank()) {
            return userRepo.findAll(pageable).map(UserManagementController::toDto);
        }
        
        return userRepo
                .findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q, q, pageable)
                .map(UserManagementController::toDto);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user by ID", description = "Returns a specific user by ID (Admin only)")
    @ApiResponse(responseCode = "200", description = "User retrieved successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    public ResponseEntity<UserDto> getUserById(@Parameter(description = "User ID") @PathVariable Long id) {
        return userRepo.findById(id)
                .map(u -> ResponseEntity.ok(toDto(u)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new user", description = "Creates a new user (Admin only)")
    @ApiResponse(responseCode = "200", description = "User created successfully")
    @ApiResponse(responseCode = "400", description = "Username already exists or invalid data")
    @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserRequest request) {
        if (userRepo.existsByUsername(request.username())) {
            return ResponseEntity.badRequest().build();
        }
        
        Role role = resolveRoleOrThrow(request.role());
        
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setRoles(Set.of(role));
        
        User saved = userRepo.save(user);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user", description = "Updates an existing user (Admin only)")
    @ApiResponse(responseCode = "200", description = "User updated successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    public ResponseEntity<UserDto> updateUser(
            @Parameter(description = "User ID") @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        
        Optional<User> opt = userRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        
        User user = opt.get();
        
        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName());
        }
        if (request.Username() != null && !request.Username().isBlank()) {
            user.setUsername(request.Username());
        }
        if (request.email() != null && !request.email().isBlank()) {
            user.setEmail(request.email());
        }
        if (request.phone() != null && !request.phone().isBlank()) {
            user.setPhone(request.phone());
        }
        
        if (request.role() != null && !request.role().isBlank()) {
            Role role = resolveRoleOrThrow(request.role());
            user.setRoles(Set.of(role));
        }
        
        User saved = userRepo.save(user);
        return ResponseEntity.ok(toDto(saved));
    }

    @PatchMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Change user password", description = "Changes password for a specific user (Admin only)")
    @ApiResponse(responseCode = "204", description = "Password changed successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    public ResponseEntity<Void> changeUserPassword(
            @Parameter(description = "User ID") @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest request) {
        
        return userRepo.findById(id).map(user -> {
            user.setPassword(passwordEncoder.encode(request.password()));
            userRepo.save(user);
            return ResponseEntity.noContent().<Void>build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user", description = "Deletes a user (Admin only)")
    @ApiResponse(responseCode = "204", description = "User deleted successfully")
    @ApiResponse(responseCode = "404", description = "User not found")
    @ApiResponse(responseCode = "400", description = "Cannot delete yourself")
    @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "User ID") @PathVariable Long id,
            Principal principal) {
        
        if (!userRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        // Prevent self-deletion
        if (principal != null) {
            String currentUsername = principal.getName();
            Optional<User> currentUser = userRepo.findByUsername(currentUsername);
            if (currentUser.isPresent() && currentUser.get().getId().equals(id)) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        userRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all roles", description = "Returns all available roles (Admin only)")
    @ApiResponse(responseCode = "200", description = "Roles retrieved successfully")
    @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    public ResponseEntity<List<String>> getAllRoles() {
        List<String> roles = roleRepo.findAll().stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Advanced user search", description = "Advanced search with multiple criteria (Admin only)")
    @ApiResponse(responseCode = "200", description = "Search results retrieved successfully")
    @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    public Page<UserDto> searchUsers(
            @Parameter(description = "Username filter") @RequestParam(required = false) String username,
            @Parameter(description = "Email filter") @RequestParam(required = false) String email,
            @Parameter(description = "Role filter") @RequestParam(required = false) String role,
            @Parameter(description = "Page number") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        // Simple implementation - can be enhanced with Specifications for complex queries
        if (username != null && !username.isBlank()) {
            return userRepo.findByUsernameContainingIgnoreCase(username, pageable)
                    .map(UserManagementController::toDto);
        }
        
        return userRepo.findAll(pageable).map(UserManagementController::toDto);
    }
}
