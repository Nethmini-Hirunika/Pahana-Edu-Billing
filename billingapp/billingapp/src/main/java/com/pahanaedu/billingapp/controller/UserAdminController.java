package com.pahanaedu.billingapp.controller;//package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.dto.ChangePasswordRequest;
import com.pahanaedu.billingapp.dto.CreateUserRequest;
import com.pahanaedu.billingapp.dto.UpdateUserRequest;
import com.pahanaedu.billingapp.dto.UserDto;
import com.pahanaedu.billingapp.model.Role;
import com.pahanaedu.billingapp.model.User;
import com.pahanaedu.billingapp.repository.RoleRepository;
import com.pahanaedu.billingapp.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;
import java.util.Set;

/**
 * Admin-only CRUD for users.
 * All endpoints require role ADMIN (class-level guard).
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminController {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    // --------- Helpers

    private static String firstRoleName(User u) {
        if (u.getRoles() == null || u.getRoles().isEmpty()) return null;
        return u.getRoles().iterator().next().getName(); // names stored as "ADMIN"/"STAFF"/"CUSTOMER"
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

    // --------- Endpoints

    /** List users with optional search (by username/fullName/email). */
    @GetMapping
    public Page<UserDto> list(@RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "10") int size,
                              @RequestParam(defaultValue = "") String q) {

        Pageable pageable = PageRequest.of(page, size);
        if (q == null || q.isBlank()) {
            return userRepo.findAll(pageable).map(UserAdminController::toDto);
        }
        return userRepo
                .findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q, q, pageable)
                .map(UserAdminController::toDto);
    }

    /** Get one user. */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getOne(@PathVariable Long id) {
        return userRepo.findById(id)
                .map(u -> ResponseEntity.ok(toDto(u)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Create user (ADMIN chooses role). */
    @PostMapping
    public ResponseEntity<UserDto> create(@Valid @RequestBody CreateUserRequest req) {
        if (userRepo.existsByUsername(req.username())) {
            return ResponseEntity.badRequest().build();
        }
        Role role = resolveRoleOrThrow(req.role());

        User u = new User();
        u.setUsername(req.username());
        u.setPassword(passwordEncoder.encode(req.password()));
        u.setFullName(req.fullName());
        u.setEmail(req.email());
        u.setPhone(req.phone());
        u.setRoles(Set.of(role));

        User saved = userRepo.save(u);
        return ResponseEntity.ok(toDto(saved));
    }

    /** Update user details and/or role. (Password change has its own endpoint.) */
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> update(@PathVariable Long id,
                                          @Valid @RequestBody UpdateUserRequest req) {

        Optional<User> opt = userRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        User u = opt.get();

        if (req.fullName() != null) u.setFullName(req.fullName());
        if (req.Username() != null) u.setUsername(  req.Username());
        if (req.email() != null)    u.setEmail(req.email());
        if (req.phone() != null)    u.setPhone(req.phone());

        if (req.role() != null && !req.role().isBlank()) {
            Role role = resolveRoleOrThrow(req.role());
            u.setRoles(Set.of(role));
        }

        // Prevent username duplication if you later allow username edit:
        // if (req.username()!=null && userRepo.existsByUsernameAndIdNot(req.username(), id)) ...

        User saved = userRepo.save(u);
        return ResponseEntity.ok(toDto(saved));
    }

    /** Change password. */
    @PatchMapping("/{id}/password")
    public ResponseEntity<Object> changePassword(@PathVariable Long id,
                                                 @Valid @RequestBody ChangePasswordRequest req) {
        return userRepo.findById(id).map(u -> {
            u.setPassword(passwordEncoder.encode(req.password()));
            userRepo.save(u);
            return ResponseEntity.noContent().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Delete user (block self delete if you want). */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Principal principal) {
        if (!userRepo.existsById(id)) return ResponseEntity.notFound().build();

        // Optional: avoid deleting currently logged-in admin by mistake
        if (principal != null) {
            String me = principal.getName();
            Optional<User> self = userRepo.findByUsername(me);
            if (self.isPresent() && self.get().getId().equals(id)) {
                return ResponseEntity.badRequest().build();
            }
        }

        userRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
