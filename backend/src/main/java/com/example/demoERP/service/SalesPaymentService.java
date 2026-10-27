package com.example.demoERP.service;

import com.example.demoERP.dto.SalesPaymentRequestDto;
import com.example.demoERP.dto.SalesPaymentResponseDto;
import com.example.demoERP.pojo.*;
import com.example.demoERP.repository.SalesHeaderRepository;
import com.example.demoERP.repository.SalesPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SalesPaymentService {

    private final SalesHeaderRepository salesHeaderRepository;
    private final SalesPaymentRepository salesPaymentRepository;

    @Transactional
    public SalesPaymentResponseDto addPayment(
            Long saleId,
            SalesPaymentRequestDto request) {

        // 1. Find the sale using its ID
        SalesHeaderPojo sale = salesHeaderRepository.findById(saleId)
                .orElseThrow(() ->
                        new RuntimeException("Sale not found"));

        BigDecimal saleTotal = sale.getTotalAmount();

        if (saleTotal == null || saleTotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Invalid sale total");
        }

        // 2. Validate payment details
        BigDecimal amount = request.getAmount();

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException(
                    "Payment amount must be greater than zero");
        }

        if (request.getPaymentMethod() == null) {
            throw new RuntimeException("Payment method is required");
        }

        // 3. Calculate existing payments
        BigDecimal totalPaid = salesPaymentRepository
                .findBySalesHeader_Id(saleId)
                .stream()
                .map(SalesPaymentPojo::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = saleTotal.subtract(totalPaid);

        // 4. Prevent overpayment
        if (amount.compareTo(balance) > 0) {
            throw new RuntimeException(
                    "Payment exceeds balance amount: " + balance);
        }

        // 5. Save the new payment
        SalesPaymentPojo payment = new SalesPaymentPojo();

        payment.setSalesHeader(sale);
        payment.setAmount(amount);
        payment.setPaymentDate(LocalDate.now());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setReferenceNumber(request.getReferenceNumber());
        payment.setNotes(request.getNotes());

        payment = salesPaymentRepository.save(payment);

        // 6. Calculate the updated paid amount and balance
        totalPaid = totalPaid.add(amount);
        balance = saleTotal.subtract(totalPaid);

        // 7. Determine payment status
        String status;

        if (totalPaid.compareTo(BigDecimal.ZERO) == 0) {
            status = "UNPAID";
        } else if (balance.compareTo(BigDecimal.ZERO) == 0) {
            status = "PAID";
        } else {
            status = "PARTIALLY_PAID";
        }

        // 8. Return payment and balance details
        return new SalesPaymentResponseDto(
                saleId,
                payment.getId(),
                saleTotal,
                amount,
                totalPaid,
                balance,
                status,
                payment.getPaymentDate()
        );
    }

    @Transactional(readOnly = true)
    public SalesPaymentResponseDto getPaymentSummary(Long saleId) {

        SalesHeaderPojo sale = salesHeaderRepository.findById(saleId)
                .orElseThrow(() ->
                        new RuntimeException("Sale not found"));

        BigDecimal saleTotal = sale.getTotalAmount();

        if (saleTotal == null || saleTotal.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Invalid sale total");
        }

        BigDecimal totalPaid = salesPaymentRepository
                .findBySalesHeader_Id(saleId)
                .stream()
                .map(SalesPaymentPojo::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal balance = saleTotal.subtract(totalPaid);

        String status;

        if (totalPaid.compareTo(BigDecimal.ZERO) == 0) {
            status = "UNPAID";
        } else if (balance.compareTo(BigDecimal.ZERO) <= 0) {
            status = "PAID";
        } else {
            status = "PARTIALLY_PAID";
        }

        return new SalesPaymentResponseDto(
                saleId,
                null,
                saleTotal,
                null,
                totalPaid,
                balance,
                status,
                null
        );
    }

    @Transactional(readOnly = true)
    public SalesHeaderPojo getSaleById(Long id) {
        return salesHeaderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Sale not found with ID: " + id));
    }
}