
package com.example.demoERP.controller;

import com.example.demoERP.pojo.PurchasePaymentPojo;
import com.example.demoERP.service.PurchasePaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/erp/purchase-payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PurchasePaymentController {

    private final PurchasePaymentService paymentService;

    public PurchasePaymentController(
            PurchasePaymentService paymentService) {
        this.paymentService = paymentService;
    }

    public static class PaymentRequest {
        private LocalDate paymentDate;
        private BigDecimal amountPaid;
        private String paymentMethod;

        public LocalDate getPaymentDate() {
            return paymentDate;
        }

        public void setPaymentDate(LocalDate paymentDate) {
            this.paymentDate = paymentDate;
        }

        public BigDecimal getAmountPaid() {
            return amountPaid;
        }

        public void setAmountPaid(BigDecimal amountPaid) {
            this.amountPaid = amountPaid;
        }

        public String getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
        }
    }

    @PostMapping("/{purchaseId}")
    public ResponseEntity<PurchasePaymentPojo> addPayment(
            @PathVariable Long purchaseId,
            @RequestBody PaymentRequest request) {

        PurchasePaymentPojo payment =
                paymentService.addPayment(
                        purchaseId,
                        request.getPaymentDate(),
                        request.getAmountPaid(),
                        request.getPaymentMethod());

        return ResponseEntity.ok(payment);
    }

    @GetMapping("/{purchaseId}")
    public ResponseEntity<List<PurchasePaymentPojo>> getPayments(
            @PathVariable Long purchaseId) {

        return ResponseEntity.ok(
                paymentService.getPaymentsByPurchaseId(purchaseId)
        );
    }
}
