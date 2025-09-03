package com.pahanaedu.billingapp.repository;

import com.pahanaedu.billingapp.model.User;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Page<User> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String u, String n, String e, Pageable pageable
    );

    Page<User> findByUsernameContainingIgnoreCase(String username, Pageable pageable);

    boolean existsByUsername(@NotBlank String username);
}





