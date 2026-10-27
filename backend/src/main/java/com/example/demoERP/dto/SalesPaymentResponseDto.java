package com.example.demoERP.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class SalesPaymentResponseDto {

    private Long saleId;
    private Long paymentId;
    private BigDecimal saleTotal;
    private BigDecimal paymentAmount;
    private BigDecimal totalPaid;
    private BigDecimal balanceAmount;
    private String status;
    private LocalDate paymentDate;
}