package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.model.Customer;
import com.pahanaedu.billingapp.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/customers")
    public String viewCustomerList(Model model) {
        model.addAttribute("customers", customerService.getAllCustomers());
        return "customers"; // This refers to customers.html
    }

    @GetMapping("/customers/add")
    public String showAddCustomerForm(Model model) {
        model.addAttribute("customer", new Customer());
        return "add_customer"; // This refers to add_customer.html
    }

    @PostMapping("/customers/save")
    public String saveCustomer(@ModelAttribute("customer") Customer customer) {
        customerService.saveCustomer(customer);
        return "redirect:/customers";
    }

    @GetMapping("/customers/delete/{id}")
    public String deleteCustomer(@PathVariable("id") Long id) {
        customerService.deleteCustomer(id);
        return "redirect:/customers";
    }


}


