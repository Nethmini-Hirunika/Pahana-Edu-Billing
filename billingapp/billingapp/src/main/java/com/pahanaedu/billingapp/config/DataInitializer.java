package com.pahanaedu.billingapp.config;

import com.pahanaedu.billingapp.model.Role;
import com.pahanaedu.billingapp.model.User;
import com.pahanaedu.billingapp.repository.RoleRepository;
import com.pahanaedu.billingapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
        initializeDefaultUsers();
    }

    private void initializeRoles() {
        createRoleIfNotExists("ROLE_ADMIN", "Administrator role with full access");
        createRoleIfNotExists("ROLE_USER", "Regular user role");
        createRoleIfNotExists("ROLE_STAFF", "Staff role with limited admin access");
        log.info("Roles initialized successfully");
    }

    private void createRoleIfNotExists(String roleName, String description) {
        if (roleRepository.findByName(roleName).isEmpty()) {
            Role role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
            log.info("Created role: {}", roleName);
        }
    }

    private void initializeDefaultUsers() {
        // Create admin user
        if (userRepository.findByUsername("admin").isEmpty()) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setEmail("admin@pahanaedu.com");
            admin.setPhone("+1234567890");
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
            log.info("Created default admin user: admin/admin123");
        } else {
            // Update existing admin password if needed
            User existingAdmin = userRepository.findByUsername("admin").get();
            existingAdmin.setPassword(passwordEncoder.encode("admin123"));
            userRepository.save(existingAdmin);
            log.info("Updated admin password");
        }

        // Create test user
        if (userRepository.findByUsername("user").isEmpty()) {
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFullName("Test User");
            user.setEmail("user@pahanaedu.com");
            user.setPhone("+1234567891");
            user.setRoles(Set.of(userRole));

            userRepository.save(user);
            log.info("Created default test user: user/user123");
        }

        log.info("Default users initialized successfully");
    }
}
