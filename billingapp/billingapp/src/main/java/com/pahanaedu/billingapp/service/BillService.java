package com.pahanaedu.billingapp.service;

import com.pahanaedu.billingapp.dto.BillDTO;
import com.pahanaedu.billingapp.dto.BillItemDTO;
import com.pahanaedu.billingapp.model.Bill;
import com.pahanaedu.billingapp.model.BillItem;
import com.pahanaedu.billingapp.model.Customer;
import com.pahanaedu.billingapp.model.Item;
import com.pahanaedu.billingapp.repository.BillRepository;
import com.pahanaedu.billingapp.repository.CustomerRepository;
import com.pahanaedu.billingapp.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BillService {

    private final BillRepository billRepository;
    private final CustomerRepository customerRepository;
    private final ItemRepository itemRepository;

    public BillService(BillRepository billRepository,
                       CustomerRepository customerRepository,
                       ItemRepository itemRepository) {
        this.billRepository = billRepository;
        this.customerRepository = customerRepository;
        this.itemRepository = itemRepository;
    }

    // 🔹 Fetch all bills
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    // 🔹 Fetch bill by ID
    public Bill getBillById(Long id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bill with ID " + id + " not found"));
    }

    // 🔹 Save or update a Bill (internal use)
    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    // 🔹 Delete a bill by ID
    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }



    // 🔹 Swagger-compatible: Create a bill with items and customer
    public Bill createBill(BillDTO billDTO) {
        // ✅ Validate Customer
        Customer customer = customerRepository.findById(billDTO.getCustomerId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Customer with ID " + billDTO.getCustomerId() + " not found"));

        // ✅ Create bill base
        Bill bill = new Bill();
        bill.setCustomer(customer);
        bill.setBillDate(LocalDateTime.now());

        List<BillItem> billItems = new ArrayList<>();
        double totalAmount = 0.0;

        // ✅ Process each item
        for (BillItemDTO itemDTO : billDTO.getItems()) {
            Item item = itemRepository.findById(itemDTO.getItemId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Item with ID " + itemDTO.getItemId() + " not found"));

            if (item.getStock() < itemDTO.getQuantity()) {
                throw new IllegalArgumentException("Insufficient stock for item: " + item.getName());
            }

            // Deduct stock
            item.setStock(item.getStock() - itemDTO.getQuantity());
            itemRepository.save(item); // Save updated stock

            BillItem billItem = new BillItem();
            billItem.setItem(item);
            billItem.setQuantity(itemDTO.getQuantity());
            billItem.setUnitPrice(item.getPrice());

            double subtotal = item.getPrice() * itemDTO.getQuantity();
            billItem.setSubtotal(subtotal);
            billItem.setBill(bill);

            billItems.add(billItem);
            totalAmount += subtotal;
        }

        bill.setItems(billItems);
        bill.setTotalAmount(totalAmount);

        // ✅ Save bill and return full object
        return billRepository.save(bill);
    }
}
