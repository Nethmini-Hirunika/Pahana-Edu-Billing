package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.model.Customer;
import com.pahanaedu.billingapp.service.CustomerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/customers")
@Tag(name = "Customer Management", description = "Complete customer management operations")
@SecurityRequirement(name = "basicAuth")
public class CustomerRestController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    @Operation(summary = "Get all customers", description = "Returns a list of all customers")
    @ApiResponse(responseCode = "200", description = "Customers retrieved successfully")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @Operation(summary = "Create new customer", description = "Creates a new customer")
    @ApiResponse(responseCode = "200", description = "Customer created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid customer data")
    public ResponseEntity<Customer> addCustomer(@Valid @RequestBody Customer customer) {
        Customer saved = customerService.saveCustomer(customer);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID", description = "Returns a specific customer by ID")
    @ApiResponse(responseCode = "200", description = "Customer retrieved successfully")
    @ApiResponse(responseCode = "404", description = "Customer not found")
    public ResponseEntity<Customer> getCustomerById(@Parameter(description = "Customer ID") @PathVariable Long id) {
        Customer customer = customerService.getCustomerById(id);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @Operation(summary = "Update customer", description = "Updates an existing customer")
    @ApiResponse(responseCode = "200", description = "Customer updated successfully")
    @ApiResponse(responseCode = "404", description = "Customer not found")
    public ResponseEntity<Customer> updateCustomer(
            @Parameter(description = "Customer ID") @PathVariable Long id,
            @Valid @RequestBody Customer customer) {
        Customer existing = customerService.getCustomerById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        customer.setId(id);
        Customer updated = customerService.saveCustomer(customer);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete customer", description = "Deletes a customer and all related bills (Admin only)")
    @ApiResponse(responseCode = "204", description = "Customer deleted successfully")
    @ApiResponse(responseCode = "404", description = "Customer not found")
    @ApiResponse(responseCode = "400", description = "Cannot delete customer with existing bills")
    @ApiResponse(responseCode = "403", description = "Access denied - Admin role required")
    public ResponseEntity<Object> deleteCustomer(@Parameter(description = "Customer ID") @PathVariable Long id) {
        try {
            Customer existing = customerService.getCustomerById(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }
            
            customerService.deleteCustomer(id);
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Cannot delete customer", 
                       "message", "Customer has associated bills. Delete bills first or use force delete.",
                       "details", e.getMessage())
            );
        }
    }
}
