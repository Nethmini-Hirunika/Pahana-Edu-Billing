package com.pahanaedu.billingapp.service;

import com.pahanaedu.billingapp.model.Customer;
import com.pahanaedu.billingapp.repository.BillRepository;
import com.pahanaedu.billingapp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private BillRepository billRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // Delete all bills associated with this customer first
        if (customer.getBills() != null && !customer.getBills().isEmpty()) {
            billRepository.deleteAll(customer.getBills());
        }
        
        // Now delete the customer
        customerRepository.deleteById(id);
    }
    
    public boolean hasAssociatedBills(Long customerId) {
        Customer customer = getCustomerById(customerId);
        return customer != null && customer.getBills() != null && !customer.getBills().isEmpty();
    }
}
