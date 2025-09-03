package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.dto.BillDTO;
import com.pahanaedu.billingapp.model.Bill;
import com.pahanaedu.billingapp.service.BillPDFService;
import com.pahanaedu.billingapp.service.BillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@Tag(name = "Bill API", description = "Manage bills and billing items")
public class BillController {

    private final BillService billService;
    private final BillPDFService billPDFService;

    public BillController(BillService billService, BillPDFService billPDFService) {
        this.billService = billService;
        this.billPDFService = billPDFService;
    }

    @GetMapping
    @Operation(summary = "Get all bills")
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get bill by ID")
    public Bill getBillById(@PathVariable Long id) {
        return billService.getBillById(id);
    }

    @PostMapping
    @Operation(summary = "Create a new bill")
    public ResponseEntity<Bill> createBill(@RequestBody BillDTO billDTO) {
        Bill createdBill = billService.createBill(billDTO);
        return ResponseEntity.ok(createdBill);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a bill by ID")
    public void deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
    }

    @GetMapping("/print/{id}")
    @Operation(summary = "View and print bill as HTML")
    public String printBill(@PathVariable Long id, org.springframework.ui.Model model) {
        Bill bill = billService.getBillById(id);
        model.addAttribute("bill", bill);
        return "bill-print";
    }


    @GetMapping("/download-pdf/{id}")
    @Operation(summary = "Download bill as PDF")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        byte[] pdfBytes = billPDFService.generateBillPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("bill_" + id + ".pdf")
                .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}

