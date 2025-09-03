package com.pahanaedu.billingapp.repository;

import com.pahanaedu.billingapp.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // No need to write any code. Spring JPA will handle CRUD automatically.
}
