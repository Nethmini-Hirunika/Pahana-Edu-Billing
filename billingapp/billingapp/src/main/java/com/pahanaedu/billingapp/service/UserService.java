package com.pahanaedu.billingapp.service;

import com.pahanaedu.billingapp.model.Role;
import com.pahanaedu.billingapp.model.User;
import com.pahanaedu.billingapp.repository.RoleRepository;
import com.pahanaedu.billingapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    public User register(String username, String password, String fullName, String email, String phone, String roleName) {
        if (userRepo.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }

        Role role = roleRepo.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);

        Set<Role> userRoles = new HashSet<>();
        userRoles.add(role);
        user.setRoles(userRoles);

        return userRepo.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepo.findByUsername(username);
    }
}
