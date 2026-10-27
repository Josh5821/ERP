package com.example.demoERP.controller;

import com.example.demoERP.dto.SalesPaymentRequestDto;
import com.example.demoERP.dto.SalesPaymentResponseDto;
import com.example.demoERP.pojo.SalesHeaderPojo;
import com.example.demoERP.service.SalesPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/erp/sales")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SalesPaymentController {

    private final SalesPaymentService salesPaymentService;

    // Add a payment for a particular sale
    @PostMapping("/{saleId}/payments")
    public ResponseEntity<SalesPaymentResponseDto> addPayment(
            @PathVariable Long saleId,
            @RequestBody SalesPaymentRequestDto request) {

        return ResponseEntity.ok(
                salesPaymentService.addPayment(saleId, request));
    }

    // Get total paid, balance and status for a particular sale
    @GetMapping("/{saleId}/payment-summary")
    public ResponseEntity<SalesPaymentResponseDto> getPaymentSummary(
            @PathVariable Long saleId) {

        return ResponseEntity.ok(
                salesPaymentService.getPaymentSummary(saleId));
    }


}