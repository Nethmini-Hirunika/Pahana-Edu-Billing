package com.pahanaedu.billingapp.dto;

import java.util.List;

public class BillDTO {
    private Long customerId;
    private List<BillItemDTO> items;

    // Constructors
    public BillDTO() {}

    public BillDTO(Long customerId, List<BillItemDTO> items) {
        this.customerId = customerId;
        this.items = items;
    }

    // Getters & Setters
    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public List<BillItemDTO> getItems() {
        return items;
    }

    public void setItems(List<BillItemDTO> items) {
        this.items = items;
    }
}
