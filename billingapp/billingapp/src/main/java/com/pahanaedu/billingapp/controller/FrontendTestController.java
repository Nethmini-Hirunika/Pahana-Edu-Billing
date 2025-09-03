package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.model.Customer;
import com.pahanaedu.billingapp.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/frontend-test")
@Tag(name = "Frontend Test", description = "Test endpoints for frontend integration without authentication")
public class FrontendTestController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/customers")
    @Operation(summary = "Get all customers (No Auth)", description = "Test endpoint to get customers without authentication")
    public ResponseEntity<List<Customer>> getAllCustomersTest() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PostMapping("/customers")
    @Operation(summary = "Create customer (No Auth)", description = "Test endpoint to create customer without authentication")
    public ResponseEntity<Customer> createCustomerTest(@RequestBody Customer customer) {
        try {
            Customer saved = customerService.saveCustomer(customer);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/customers/{id}")
    @Operation(summary = "Delete customer (No Auth)", description = "Test endpoint to delete customer without authentication")
    public ResponseEntity<Object> deleteCustomerTest(@PathVariable Long id) {
        try {
            Customer existing = customerService.getCustomerById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }
            
            customerService.deleteCustomer(id);
            return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Cannot delete customer", 
                       "message", e.getMessage(),
                       "type", e.getClass().getSimpleName())
            );
        }
    }

    @GetMapping("/test-connection")
    @Operation(summary = "Test Backend Connection", description = "Simple endpoint to test if backend is reachable")
    public ResponseEntity<Map<String, Object>> testConnection() {
        return ResponseEntity.ok(Map.of(
            "status", "Backend is working",
            "timestamp", System.currentTimeMillis(),
            "message", "All systems operational"
        ));
    }
}
