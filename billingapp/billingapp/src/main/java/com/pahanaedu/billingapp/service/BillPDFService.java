package com.pahanaedu.billingapp.service;

import com.pahanaedu.billingapp.model.Bill;
import com.pahanaedu.billingapp.repository.BillRepository;
import com.pahanaedu.billingapp.util.PdfGeneratorUtil;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class BillPDFService {

    private final BillRepository billRepository;
    private final TemplateEngine templateEngine;

    public BillPDFService(BillRepository billRepository, TemplateEngine templateEngine) {
        this.billRepository = billRepository;
        this.templateEngine = templateEngine;
    }

    public byte[] generateBillPdf(Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new IllegalArgumentException("Bill not found"));

        Context context = new Context();
        context.setVariable("bill", bill);

        String html = templateEngine.process("bill-pdf", context);
        return PdfGeneratorUtil.generatePdfFromHtml(html);
    }
}