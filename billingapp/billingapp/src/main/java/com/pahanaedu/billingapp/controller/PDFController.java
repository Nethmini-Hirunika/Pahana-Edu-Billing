package com.pahanaedu.billingapp.controller;

import com.pahanaedu.billingapp.service.BillPDFService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pdf")
public class PDFController {

    private final BillPDFService billPDFService;

    public PDFController(BillPDFService billPDFService) {
        this.billPDFService = billPDFService;
    }

    @GetMapping("/bill/{billId}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long billId) {
        byte[] pdf = billPDFService.generateBillPdf(billId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice_" + billId + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdf);
    }
}

