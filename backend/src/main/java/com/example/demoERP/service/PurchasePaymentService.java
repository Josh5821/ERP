
package com.example.demoERP.service;

import com.example.demoERP.pojo.PurchaseHeaderPojo;
import com.example.demoERP.pojo.PurchasePaymentPojo;
import com.example.demoERP.repository.PurchaseHeaderRepository;
import com.example.demoERP.repository.PurchasePaymentRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class PurchasePaymentService {

    private final PurchasePaymentRepository paymentRepository;
    private final PurchaseHeaderRepository purchaseRepository;

    public PurchasePaymentService(
            PurchasePaymentRepository paymentRepository,
            PurchaseHeaderRepository purchaseRepository) {
        this.paymentRepository = paymentRepository;
        this.purchaseRepository = purchaseRepository;
    }

    @Transactional
    public PurchasePaymentPojo addPayment(
            Long purchaseId,
            LocalDate paymentDate,
            BigDecimal amountPaid,
            String paymentMethod) {

        if (amountPaid == null ||
                amountPaid.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Payment amount must be greater than zero");
        }

        PurchaseHeaderPojo purchase =
                purchaseRepository.findById(purchaseId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase not found: " + purchaseId));

        if (paymentDate == null) {
            throw new IllegalArgumentException(
                    "Payment date is required");
        }

        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new IllegalArgumentException(
                    "Payment method is required");
        }

        PurchasePaymentPojo payment = new PurchasePaymentPojo();
        payment.setPurchaseHeader(purchase);
        payment.setPaymentDate(paymentDate);
        payment.setAmountPaid(amountPaid);
        payment.setPaymentMethod(paymentMethod);

        PurchasePaymentPojo savedPayment =
                paymentRepository.save(payment);

        updatePaymentStatus(purchase);

        return savedPayment;
    }

    private void updatePaymentStatus(
            PurchaseHeaderPojo purchase) {

        BigDecimal totalPaid =
                paymentRepository.getTotalPaidByPurchaseId(
                        purchase.getId());

        if (totalPaid == null) {
            totalPaid = BigDecimal.ZERO;
        }

        BigDecimal totalAmount = purchase.getTotalAmount();

        if (totalAmount == null ||
                totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalStateException(
                    "Purchase total amount is invalid");
        }

        if (totalPaid.compareTo(BigDecimal.ZERO) == 0) {
            purchase.setPaymentStatus("UNPAID");
        } else if (totalPaid.compareTo(totalAmount) < 0) {
            purchase.setPaymentStatus("PARTIAL");
        } else if (totalPaid.compareTo(totalAmount) == 0) {
            purchase.setPaymentStatus("PAID");
        } else {
            purchase.setPaymentStatus("ADVANCE");
        }

        purchaseRepository.save(purchase);
    }

    public List<PurchasePaymentPojo> getPaymentsByPurchaseId(Long purchaseId) {
        if (!purchaseRepository.existsById(purchaseId)) {
            throw new RuntimeException("Purchase not found: " + purchaseId);
        }

        return paymentRepository
                .findByPurchaseHeader_IdOrderByPaymentDateDescIdDesc(purchaseId);
    }
}
